// cypress/e2e/sign_in.cy.js
describe('User Sign-In', () => {
    it('allows a user to sign in', () => {
      cy.visit('/sign-in') // Adjust the URL to your sign-in page
         // Wait for the email input to be visible
    cy.get('input[name="identifier"]').should('be.visible').type('gkmxrzy400@qmail.edu.pl')
    cy.get('input[name="password"]').should('be.visible').type('azertQSDFG1234')
    cy.get('button[type="submit"]').click()
      cy.url().should('include', '/') // Adjust the URL to where the user is redirected after sign-in
    })
  })