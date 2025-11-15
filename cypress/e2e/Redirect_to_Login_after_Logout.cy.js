describe('Logout functionality', () => {
  beforeEach(() => {
    // Simulate login before each test
    cy.visit('/login');
    cy.get('#email').type('iamfelipediaz@gmail.com');
    cy.get('#password').type('vue1234');
    cy.get('.login-btn').click();

    // Verify login was successful
    cy.url().should('include', '/');
  });

  it('Should redirect to login page after logout', () => {
    // Click the logout button
    cy.get('[data-cy=logout-btn]').click();
    // Verify the user is redirected to login
    cy.url().should('include', '/login');
    // Verify login form is visible again
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
  });
});
