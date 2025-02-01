describe('Book an Appointment with Cash Payment', () => {
    it('allows a signed-in user to book an appointment with cash payment', () => {
      // Visit the sign-in page
      cy.visit('/sign-in') // Adjust the URL to your sign-in page
  
      cy.get('input[name="identifier"]').should('be.visible').type('gkmxrzy400@qmail.edu.pl')
      cy.get('input[name="password"]').should('be.visible').type('azertQSDFG1234')
      cy.get('button[type="submit"]').click()
     cy.url().should('include', '/') // Adjust the URL to where the user is redirected after sign-in
     cy.wait(10000) // Wait for 5 seconds
      // Visit the appointments page
      cy.visit('/appointments') // Adjust the URL to your appointments page
      cy.wait(10000) // Wait for 5 seconds

       // Wait for the doctor card to be visible and click the book appointment button
        cy.get('button').contains('Book Appointment').should('be.visible').click()



         // Explicitly wait for a certain amount of time before checking for the form's visibility
      cy.wait(20000) // Wait for 5 seconds

    // Wait for the appointment form to be visible
      cy.get('form').should('be.visible', { timeout: 30000 }) // Increase timeout to 10 seconds
    // Fill in the appointment details
    cy.get('input[name="patientName"]').should('be.visible').type('John Doe', { timeout: 10000 }) // Increase timeout to 10 seconds
    cy.get('input[name="patientEmail"]').should('be.visible').type('john@example.com', { timeout: 10000 }) // Increase timeout to 10 seconds
    // Interact with the calendar to pick a date
    cy.wait(10000) // Wait for 5 seconds
    // Interact with the calendar to pick a date
    cy.get('button').contains('January 30th, 2025').click() // Adjust the date as needed
    cy.wait(10000) // Wait for 5 seconds
    cy.get('.rounded-md').contains('31').click({force: true}) // Adjust the date as needed   cy.get('input[name="appointmentTime"]').should('be.visible').type('10:00 AM', { timeout: 10000 }) // Increase timeout to 10 seconds
   
   // Close the calendar if necessary
   cy.get('body').click(0, 0) // Click outside the calendar to close it

   
   
   // Wait for the appointment time options to be fetched and visible
   cy.get('button').contains('4:00 PM').should('be.visible', { timeout: 20000 }) // Adjust the time as needed

   // Select an appointment time
   cy.get('button').contains('4:00 PM').click() // Adjust the time as needed





    /// Select cash payment method
    cy.get('label[for="cash"]').click() // Adjust the selector to match the actual element

  
      // Submit the form
      cy.get('button[type="submit"]').click()
      cy.wait(30000) // Wait for 5 seconds
      // Check the URL to ensure the user is redirected to the confirmation page
      cy.url().should('include', '/appointments/confirmation') // Adjust the URL to your confirmation page
      cy.wait(15000) // Wait for 5 seconds

      // Check for a confirmation message
      cy.contains('Your appointment has been successfully booked').should('be.visible')
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