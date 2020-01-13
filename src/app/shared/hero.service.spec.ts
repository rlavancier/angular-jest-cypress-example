import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { HeroService } from './hero.service'
import { Observable } from 'rxjs'

describe('HeroService', () => {
  function buildService() {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [HeroService],
      imports: [HttpClientTestingModule]
    })

    return {
      service: TestBed.get<HeroService>(HeroService),
      http: TestBed.get(HttpTestingController)
    }
  }

  function testError(f: (s: HeroService) => Observable<any>, methode: string, url: string) {
    it('should handle 500 error', (done) => {
      const { service, http } = buildService()

      f(service)
        .subscribe(
          () => undefined,
          (err) => {
            http.verify()
            expect(err.status).toEqual(500)
            expect(err.statusText).toEqual('Server error')
            done()
          }
        )

      http.expectOne({ methode, url})
        .flush('Server error', { status: 500, statusText: 'Server error' })

    })
  }

  describe('getHeroes', () => {
    testError((service) => service.getHeroes(), 'get', 'api/heroes')

    it('should be created', () => {
      const { service, http } = buildService()

      service.getHeroes().subscribe()

      http.expectOne({ methode: 'get', url: 'api/heroes'})
      http.verify()
    })
  })

  describe('getHero', () => {
    testError((service) => service.getHero(10), 'get', 'api/heroes/10')

    it('should be created', () => {
      const { service, http } = buildService()

      service.getHero(10)
        .subscribe()

      http.expectOne({ methode: 'get', url: 'api/heroes/10'})

      http.verify()
    })
  })

  describe('addHero', () => {
    testError((service) => service.addHero('test'), 'get', 'api/heroes')

    it('should be created', () => {
      const { service, http } = buildService()

      service.addHero('test')
        .subscribe()

      const httpAssert = http.expectOne({ methode: 'get', url: 'api/heroes'})

      expect(httpAssert.request.body).toEqual({ name: 'test' })

      http.verify()
    })
  })

  describe('deleteHero', () => {
    testError((service) => service.deleteHero({ id: 10, name: 'test'}), 'get', 'api/heroes/10')

    it('should be created', () => {
      const { service, http } = buildService()

      service.deleteHero({ id: 10, name: 'test'})
        .subscribe()

      http.expectOne({ methode: 'delete', url: 'api/heroes/10'})

      http.verify()
    })
  })

  describe('updateHero', () => {
    testError((service) => service.updateHero({ id: 10, name: 'test'}), 'get', 'api/heroes')

    it('should be created', () => {
      const { service, http } = buildService()

      service.updateHero({ id: 10, name: 'test'})
        .subscribe()

      const httpAssert = http.expectOne({ methode: 'get', url: 'api/heroes'})

      expect(httpAssert.request.body).toEqual({ id: 10, name: 'test'})

      http.verify()
    })
  })
})
