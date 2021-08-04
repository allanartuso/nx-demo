describe('User form', () => {
  beforeEach(() => {
    // cy.intercept('GET', '/api/users/1', {
    //   fixture: 'user'
    // }).as('getUser');

    cy.intercept('GET', '/api/users/1', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'allan.artuso@gmail.com',
        firstName: 'Allan',
        lastName: 'Artuso'
      }
    }).as('getUser');

    cy.intercept('PUT', '/api/users/1', req => {
      expect(req.body).to.deep.equal({ id: '1', email: 'artuso@gmail.com', firstName: 'Allan', lastName: 'Artuso' });

      req.reply({
        body: { id: '1', email: 'artuso@gmail.com', firstName: 'Allan', lastName: 'Artuso' }
      });
    }).as('saveUser');

    cy.visit('/users/1');
  });

  it('updates the form', () => {
    cy.get('[label="Email"] input').updateInputValue('artuso@gmail.com');
    cy.get('[data-test=demo-submit-button]').click();

    cy.wait('@saveUser').its('request.body').should('deep.equal', {
      id: '1',
      email: 'artuso@gmail.com',
      firstName: 'Allan',
      lastName: 'Artuso'
    });
  });
});
