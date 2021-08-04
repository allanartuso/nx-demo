import { userDtoFixture } from '@demo/demo/feature-users/test';
import { UserDto } from '@demo/shared/acm/data-access/users';
import { DEFAULT_PAGE_SIZE } from '@demo/shared/data-access';

const selectors = {
  nextPageButton: '[aria-label="Next page"]',
  previousPageButton: '[aria-label="Previous page"]',
  firstPageButton: '[aria-label="First page"]',
  checkbox: '[role="checkbox"]',
  columnHeader: '[role="columnheader"]'
};

const routes = {
  getUsers: 'getUsers',
  deleteUsers: 'deleteUsers'
};

const apiUrls = {
  query: '/api/users/query',
  deleteUsers: '/api/users/bulk'
};

function stubUsers() {
  const users = userDtoFixture.createUsers(35);

  cy.intercept({ method: 'POST', url: apiUrls.query }, req => {
    const requestOptions = req.body;

    const pageIndex = requestOptions.page - 1;
    const pageSize = requestOptions.pageSize;
    const res = users.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(routes.getUsers);

  return users;
}

function assertCorrectQueryRequested(page: number, sort?: Array<{ field: string; direction: string }>) {
  let requestOptions: any = {
    page,
    pageSize: DEFAULT_PAGE_SIZE
  };

  if (sort) {
    requestOptions = {
      ...requestOptions,
      sort
    };
  }

  cy.wait(`@${routes.getUsers}`).its('request.body').should('deep.equal', requestOptions);
}

describe('Users list', () => {
  let users: UserDto[];

  beforeEach(() => {
    users = stubUsers();

    cy.visit('/users');
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);
  });

  it('paging through the table', () => {
    cy.get(selectors.firstPageButton).should('be.disabled');
    cy.get(selectors.previousPageButton).should('be.disabled');

    cy.get(selectors.nextPageButton).click();
    assertCorrectQueryRequested(3);

    cy.get(selectors.firstPageButton).should('be.enabled');
    cy.get(selectors.previousPageButton).should('be.enabled');

    cy.get(selectors.nextPageButton).click();
    assertCorrectQueryRequested(4);

    cy.get(selectors.nextPageButton).click();

    cy.get(selectors.nextPageButton).should('be.disabled');

    cy.get(selectors.previousPageButton).click();
    assertCorrectQueryRequested(2);

    cy.get(selectors.nextPageButton).should('be.enabled');

    cy.get(selectors.firstPageButton).click();
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);

    cy.get(selectors.firstPageButton).should('be.disabled');
    cy.get(selectors.previousPageButton).should('be.disabled');
  });

  it('request sort', () => {
    cy.get(selectors.columnHeader).contains('Email').click();
    const sort = [{ field: 'email', direction: 'asc' }];
    assertCorrectQueryRequested(1, sort);
    assertCorrectQueryRequested(2, sort);
  });

  it('delete users', () => {
    const indexes = [0, 1];
    const deletedUsers = indexes.map(index => users[index]);

    cy.intercept({ method: 'DELETE', url: apiUrls.deleteUsers }, req => {
      req.reply(deletedUsers);
    }).as(routes.deleteUsers);

    indexes.forEach(index => {
      cy.get(selectors.checkbox).eq(index).click();
    });

    cy.get('button').contains('delete').click();
    cy.get('button').contains('Confirm').click();

    cy.wait(`@${routes.deleteUsers}`)
      .its('request.body')
      .should(
        'deep.equal',
        deletedUsers.map(user => user.id)
      );
  });
});
