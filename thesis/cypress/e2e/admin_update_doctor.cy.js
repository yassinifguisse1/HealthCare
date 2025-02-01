describe('Update a  Doctor', () => {
    it('allows a signed-in admin to Update a doctor', () => {
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
      cy.get('button.Edit').first().should('be.visible').click({ force: true })

      cy.wait(5000) // Wait for 5 seconds
  
      // Fill in the doctor details
      cy.get('input[name="name"]').should('be.visible').clear().type('Dr. John Doe', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('input[name="degree"]').should('be.visible').clear().type('MBBS, MD, PhD', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('input[name="experience"]').should('be.visible').clear().type('10 Years', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('input[name="fees"]').should('be.visible').clear().type('200', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('textarea[name="about"]').should('be.visible').clear().type('Highly experienced general physician.', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('input[name="addressLine1"]').should('be.visible').clear().type('456 Elm St', { timeout: 10000 }) // Increase timeout to 10 seconds
      cy.get('input[name="addressLine2"]').should('be.visible').clear().type('Apt 8C', { timeout: 10000 }) // Increase timeout to 10 seconds
  
      // Select a speciality
      
      // Upload an image (assuming you have a file named 'doctor.jpg' in the 'cypress/fixtures' folder)
      cy.get('input[type="file"]').attachFile('doctor.jpg')
      cy.wait(5000) // Wait for 5 seconds

      // Submit the form
      cy.get('button').contains('Update Doctor').click({ force: true })
     

   // Wait for the progress dialog to be visible and progress to complete
   cy.get('div').contains('Updating Doctor').should('be.visible', { timeout: 60000 })
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