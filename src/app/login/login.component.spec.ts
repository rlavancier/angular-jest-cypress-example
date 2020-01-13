import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { of, Observable, Subject, throwError } from 'rxjs'
import { setInputValue, click } from 'testing'
import { LoginComponent } from './login.component'
import { LoginService } from './login.service'


describe('LoginComponent', () => {
  function emailInput(nativeElement: HTMLElement): HTMLInputElement {
    return nativeElement.querySelector('[name="email"]')
  }
  function passwordInput(nativeElement: HTMLElement): HTMLInputElement {
    return nativeElement.querySelector('[name="password"]')
  }
  function passwordVisibilityButton(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('#password-visibility')
  }
  function submitButton(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('button[type="submit"]')
  }
  function loading(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('mat-spinner')
  }
  function error(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('#error-message')
  }

  async function buildComponent(login$: Observable<boolean> = new Subject()) {
    const routerFake = {
      navigate: jest.fn()
    }

    const loginServiceFake = {
      login: jest.fn().mockReturnValue(login$)
    }

    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: Router, useValue: routerFake },
      ],
      imports: [
        FormsModule,

        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
      ]
    })

    TestBed.overrideProvider(LoginService, { useValue: loginServiceFake })

    const fixture: ComponentFixture<LoginComponent> = TestBed.createComponent(LoginComponent)

    fixture.autoDetectChanges()

    await fixture.whenStable()

    return {
      fixture,
      routerFake,
      loginServiceFake,
    }
  }

  it('should create', async () => {
    const { fixture, loginServiceFake, routerFake } = await buildComponent()

    expect(loginServiceFake.login).not.toHaveBeenCalled()
    expect(routerFake.navigate).not.toHaveBeenCalled()

    expect(emailInput(fixture.nativeElement)).not.toBeNull()
    expect(passwordInput(fixture.nativeElement)).not.toBeNull()
    expect(passwordVisibilityButton(fixture.nativeElement)).not.toBeNull()
    expect(submitButton(fixture.nativeElement)).not.toBeNull()
    expect(loading(fixture.nativeElement)).toBeNull()
    expect(error(fixture.nativeElement)).toBeNull()
  })

  describe('form', () => {
    it('submit button should be disabled without infos', async () => {
      const { fixture, loginServiceFake, routerFake } = await buildComponent()

      expect(submitButton(fixture.nativeElement).getAttribute('disabled')).toEqual('true')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(loginServiceFake.login).not.toHaveBeenCalled()
      expect(routerFake.navigate).not.toHaveBeenCalled()
    })

    it('do nothing without a password', async () => {
      const { fixture, loginServiceFake } = await buildComponent()

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')

      expect(submitButton(fixture.nativeElement).getAttribute('disabled')).toEqual('true')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(loginServiceFake.login).not.toHaveBeenCalled()
    })

    it('do nothing without a good email', async () => {
      const { fixture, loginServiceFake, routerFake } = await buildComponent()

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')

      expect(submitButton(fixture.nativeElement).getAttribute('disabled')).toEqual('true')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(loginServiceFake.login).not.toHaveBeenCalled()
      expect(routerFake.navigate).not.toHaveBeenCalled()
    })

    it('submit sumbit form with good infos', async () => {
      const { fixture, loginServiceFake, routerFake } = await buildComponent()

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')

      await click(fixture, submitButton(fixture.nativeElement))

      expect(loginServiceFake.login).toHaveBeenCalledWith('test@test.com', 'test')
      expect(routerFake.navigate).not.toHaveBeenCalled()
    })
  })

  describe('spinner', () => {
    it('should be displayed after submit', async () => {
      const login$ = new Subject<boolean>()
      const { fixture } = await buildComponent(login$)

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(emailInput(fixture.nativeElement)).toBeNull()
      expect(passwordInput(fixture.nativeElement)).toBeNull()
      expect(passwordVisibilityButton(fixture.nativeElement)).toBeNull()
      expect(submitButton(fixture.nativeElement)).toBeNull()
      expect(loading(fixture.nativeElement)).not.toBeNull()
      expect(error(fixture.nativeElement)).toBeNull()
    })
  })

  describe('login call', () => {
    it('should be redirected after submit with good login', async () => {
      const { fixture, routerFake } = await buildComponent(of(true))

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(routerFake.navigate).toHaveBeenCalledWith([ 'dashboard' ])

      expect(error(fixture.nativeElement)).toBeNull()
    })

    it('should be displayed after submit', async () => {
      const { fixture, routerFake } = await buildComponent(of(false))

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(routerFake.navigate).not.toHaveBeenCalled()

      const errorMessage = error(fixture.nativeElement)

      expect(errorMessage).not.toBeNull()
      expect(errorMessage.textContent.trim()).toEqual('Wrong login')
    })

    it('should handle network error', async () => {
      const { fixture, routerFake } = await buildComponent(throwError('error'))

      await setInputValue(fixture, emailInput(fixture.nativeElement), 'test@test.com')
      await setInputValue(fixture, passwordInput(fixture.nativeElement), 'test')
      await click(fixture, submitButton(fixture.nativeElement))

      expect(routerFake.navigate).not.toHaveBeenCalled()

      const errorMessage = error(fixture.nativeElement)

      expect(errorMessage).not.toBeNull()
      expect(errorMessage.textContent.trim()).toEqual('Wrong login')
    })
  })
})
