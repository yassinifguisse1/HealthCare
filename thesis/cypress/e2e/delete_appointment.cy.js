describe('Delete an Appointment', () => {
    it('allows a signed-in user to delete an appointment', () => {
      // Visit the sign-in page
      cy.visit('/sign-in') // Adjust the URL to your sign-in page
  
      cy.get('input[name="identifier"]').should('be.visible').type('gkmxrzy400@qmail.edu.pl')
      cy.get('input[name="password"]').should('be.visible').type('azertQSDFG1234')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/') // Adjust the URL to where the user is redirected after sign-in
      cy.wait(20000) // Wait for 5 seconds

      // Visit the My Appointments page
      cy.visit('/MyAppointements') // Adjust the URL to your My Appointments page
  
      // Wait for the appointments table to be visible
      cy.get('table').should('be.visible', { timeout: 20000 }) // Increase timeout to 20 seconds
  
      // Click the "MoreHorizontal" button for the first appointment
      cy.get('button').filter('.h-8.w-8.p-0').first().click({ force: true })
      cy.wait(10000)
      // Click the "Cancel appointment" option from the dropdown menu
    cy.get('div[role="menuitem"]').contains('Delete appointment').click({ force: true })
  
    })
  
    // Add a delay between tests to avoid hitting the rate limit
    afterEach(() => {
      cy.wait(20000) // Wait for 20 seconds
    })
  
    // Add error handling to catch uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Log the error to the console
      console.error('Uncaught exception:', err)
      // Prevent Cypress from failing the test
      return false
    })
  })