import { LoginService } from './login.service'
import { async } from '@angular/core/testing'

describe('LoginService', () => {
  const service: LoginService = new LoginService()

  describe('login', () => {
    it('should be created', (done) => {
      const call = service.login('test', 'test')

      call
        .subscribe((res) => {
          expect(res).toBe(false)
          done()
        })
    })

    it('should be created', async(() => {
      const call = service.login('test@test.com', 'test')

      call
        .subscribe((res) => {
          expect(res).toBe(true)
        })
    }))
  })
})
