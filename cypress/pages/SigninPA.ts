export class SigninPA {
  public static goTo() {
    cy.visit('/login')
  }

  public static fullfillForm() {
    cy.get('app-login [name="email"]').type('test@test.com')
    cy.get('app-login [name="password"]').type('test')
  }

  public static goToDashboard() {
    this.goTo()
    this.fullfillForm()

    cy.get('app-login button[type="submit"]').click()
  }
}
