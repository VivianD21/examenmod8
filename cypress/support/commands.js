// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando personalizado para login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[type="submit"]').click()
})

// Comando para crear un usuario de prueba
Cypress.Commands.add('createTestUser', (email, password) => {
  cy.visit('/register')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#confirmPassword').type(password)
  cy.get('button[type="submit"]').click()
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-btn"]').click()
})