import { SigninPA } from '../pages/SigninPA'

describe('Login', () => {
  beforeEach(() => {
    SigninPA.goTo()
  })

  it('has correct title', () => {
    cy.title().should('eq', 'Testing')
  })

  it('should login and be redirected', () => {
    SigninPA.goToDashboard()

    cy.location('pathname').should('eq', '/dashboard')
  })
})
