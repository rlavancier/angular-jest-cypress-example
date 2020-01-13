export class DashboardPA {
  public static goTo() {
    cy.visit('dashboard')
  }

  public static goToDetail() {
    cy.get('app-hero').first().click()
  }
}
