import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import { DEFAULT_PAGE_SIZE, QueryOptionsDto, SortingField } from '@demo/shared/data-model';

export const usersListSelectors = {
  nextPageButton: '[aria-label="Next page"]',
  previousPageButton: '[aria-label="Previous page"]',
  firstPageButton: '[aria-label="First page"]',
  checkbox: '[role="checkbox"]',
  columnHeader: '[role="columnheader"]'
};

export const usersListRoutes = {
  getUsers: 'getUsers',
  deleteUsers: 'deleteUsers'
};

const usersListApiUrls = {
  query: '/api/users/query',
  deleteUsers: '/api/users/bulk'
};

export function stubUsers(): UserDto[] {
  const users = createPersistentUsers(35);

  cy.intercept({ method: 'POST', url: usersListApiUrls.query }, req => {
    const queryOptions = req.body;
    const pageIndex = queryOptions.page - 1;
    const pageSize = queryOptions.pageSize;
    const res = users.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(usersListRoutes.getUsers);

  return users;
}

export function assertCorrectQueryRequested(page: number, sort?: SortingField[]): void {
  let queryOptions: QueryOptionsDto = {
    page,
    pageSize: DEFAULT_PAGE_SIZE
  };

  if (sort) {
    queryOptions = { ...queryOptions, sort };
  }

  cy.wait(`@${usersListRoutes.getUsers}`).its('request.body').should('deep.equal', queryOptions);
}

export function stubDeleteUsers(deletedUsers: UserDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: usersListApiUrls.deleteUsers }, req => {
    req.reply(deletedUsers);
  }).as(usersListRoutes.deleteUsers);

  indexes.forEach(index => {
    cy.get(usersListSelectors.checkbox).eq(index).click();
  });
}
