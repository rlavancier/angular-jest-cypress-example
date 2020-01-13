import { SigninPA } from '../pages/SigninPA'
import { DashboardPA } from '../pages/DashboardPA'

describe('Hero Detail', () => {
  beforeEach(() => {
    SigninPA.goToDashboard()
    DashboardPA.goToDetail()
  })

  it('has correct title', () => {
    cy.title().should('eq', 'Testing')
  })
})
