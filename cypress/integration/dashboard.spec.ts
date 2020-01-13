import { SigninPA } from '../pages/SigninPA'
import { DashboardPA } from '../pages/DashboardPA'

describe('Dashboard', () => {
  beforeEach(() => {
    SigninPA.goToDashboard()
  })

  it('has correct title', () => {
    cy.title().should('eq', 'Testing')
  })

  it('should display 10 heroes', () => {
    cy.get('app-hero').should('have.length', 10)
  })

  it('should redirect to one hero detail page', () => {
    DashboardPA.goToDetail()

    cy.location('pathname').should('eq', '/detail/11')
  })
})
