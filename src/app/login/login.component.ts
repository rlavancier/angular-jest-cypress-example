import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { LoginService } from './login.service'
import { Router } from '@angular/router'
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  providers: [ LoginService ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  public hasVisiblePassword = false
  public hasError = false
  public isLoading = false

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  public checkLogin(form: FormControl): void {
    this.hasError = false
    this.isLoading = true

    const email = form.value.email
    const password = form.value.password

    this.loginService.login(email, password)
      .pipe(finalize(() =>  this.isLoading = false))
      .subscribe(
        (isGoodLogin) => {
          if (!isGoodLogin)
            this.hasError = true
          else
            this.router.navigate([ 'dashboard' ])
        },
        () => this.hasError = true
      )
  }
}
