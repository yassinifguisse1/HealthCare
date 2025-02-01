describe('Delete a  Doctor', () => {
    it('allows a signed-in admin to Delete a doctor', () => {
      // Visit the sign-in page
      cy.visit('/sign-in') // Adjust the URL to your sign-in page
  
      cy.get('input[name="identifier"]').should('be.visible').type('yassinifguisse100@gmail.com')
      cy.get('input[name="password"]').should('be.visible').type('Yassin1234@@')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/') // Adjust the URL to where the user is redirected after sign-in
      cy.wait(20000) // Wait for 30 seconds
  
      // Visit the admin dashboard page
      cy.visit('/admin') // Adjust the URL to your admin dashboard page
      cy.wait(20000) // Wait for 20 seconds
  
      // Navigate to the Doctor Management page
      cy.get('a[href*="/admin/doctors"]').contains('Doctor Management').should('be.visible').click({ force: true })
      cy.wait(30000) // Wait for 30 seconds
  
      // Click the edit button for the first doctor in the list
      cy.get('button.Delete').first().should('be.visible').click({ force: true })

      cy.wait(5000) // Wait for 5 seconds
      cy.contains('Confirm Deletion').should('be.visible', { timeout: 60000 })
      
      cy.wait(5000) // Wait for 5 seconds

      // Submit the form
      cy.get('button').contains('Delete').click({ force: true })
     
  
   //    cy.get('div').contains('Doctor added successfully!').should('be.visible', { timeout: 60000 })
      // Check for a success message
    //   cy.contains('Doctor added successfully!').should('be.visible', { timeout: 60000 })
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