import { UserDto } from '@demo/demo/data-model/users';
import { SortingDirection, SortingField } from '@demo/shared/data-model/common';
import {
  assertCorrectQueryRequested,
  stubDeleteUsers,
  stubUsers,
  usersListRoutes,
  usersListSelectors
} from '../../support/users/users-list';

describe('Users list', () => {
  let users: UserDto[];

  beforeEach(() => {
    users = stubUsers();

    cy.visit('/users');
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);
  });

  it('paging through the table', () => {
    cy.get(usersListSelectors.firstPageButton).should('be.disabled');
    cy.get(usersListSelectors.previousPageButton).should('be.disabled');

    cy.get(usersListSelectors.nextPageButton).click();
    assertCorrectQueryRequested(3);

    cy.get(usersListSelectors.firstPageButton).should('be.enabled');
    cy.get(usersListSelectors.previousPageButton).should('be.enabled');

    cy.get(usersListSelectors.nextPageButton).click();
    assertCorrectQueryRequested(4);

    cy.get(usersListSelectors.nextPageButton).click();

    cy.get(usersListSelectors.nextPageButton).should('be.disabled');

    cy.get(usersListSelectors.previousPageButton).click();
    assertCorrectQueryRequested(2);

    cy.get(usersListSelectors.nextPageButton).should('be.enabled');

    cy.get(usersListSelectors.firstPageButton).click();
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);

    cy.get(usersListSelectors.firstPageButton).should('be.disabled');
    cy.get(usersListSelectors.previousPageButton).should('be.disabled');
  });

  it('request sort', () => {
    cy.get(usersListSelectors.columnHeader).contains('Email').click();
    const sort: SortingField[] = [{ field: 'email', direction: SortingDirection.ASCENDING }];
    assertCorrectQueryRequested(1, sort);
    assertCorrectQueryRequested(2, sort);
  });

  it('delete users', () => {
    const indexes = [0, 1];
    const deletedUsers = indexes.map(index => users[index]);

    stubDeleteUsers(deletedUsers, indexes);

    cy.get('button').contains('delete').click();
    cy.get('button').contains('Confirm').click();

    cy.wait(`@${usersListRoutes.deleteUsers}`)
      .its('request.body')
      .should(
        'deep.equal',
        deletedUsers.map(user => user.id)
      );
  });
});
