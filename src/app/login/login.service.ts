import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'

export class LoginService {
  public login(email: string, password: string): Observable<boolean> {
    const hasGoodLogin = email === 'test@test.com' && password === 'test'
    return of(hasGoodLogin)
      .pipe(delay(500))
  }
}
