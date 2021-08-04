import { userDtoFixture } from '@demo/demo/feature-users/test';

describe('Users list', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/users/query', req => {
      req.reply(userDtoFixture.createUsers(10));
    }).as('getUsers');

    cy.visit('/users');
  });

  it('delete users', () => {});
});
