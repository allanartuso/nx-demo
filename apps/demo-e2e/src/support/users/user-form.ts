import { UserDto } from '@demo/demo/feature-users';

export const userFormSelectors = {
  emailInput: '[label="Email"] input',
  firstNameInput: '[label="First name"] input',
  lastNameInput: '[label="Last name"] input'
};

export const userFormRoutes = {
  getUser: 'getUser',
  updateUser: 'updateUser'
};

export function stubGetUser(): void {
  cy.intercept('GET', '/api/users/1', {
    fixture: 'user'
  }).as(userFormRoutes.getUser);
}

export function stubUpdateUser(): UserDto {
  const updatedUser = { id: '1', email: 'artuso@gmail.com', firstName: 'Allan', lastName: 'Artuso' };

  cy.intercept('PUT', '/api/users/1', req => {
    expect(req.body).to.deep.equal(updatedUser);

    req.reply({
      body: updatedUser
    });
  }).as(userFormRoutes.updateUser);

  return updatedUser;
}
