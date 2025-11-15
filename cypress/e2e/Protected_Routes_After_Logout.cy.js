describe('Protected routes', () => {
  it('Should not allow access to /admin after logout', () => {
    // Log in first
    cy.visit('/login');
    cy.get('#email').type('iamfelipediaz@gmail.com');
    cy.get('#password').type('vue1234');
    cy.get('button[type="submit"]').click();

    // Confirm successful login
    cy.url().should('include', '/');

    // Click the logout button
    cy.get('[data-cy=logout-btn]').click();

    // Ensure redirected to login
    cy.url().should('include', '/login');

    // Try to visit a protected route manually
    cy.visit('/admin');

    // The app should automatically redirect back to login
    cy.url().should('include', '/login');
  });
});
