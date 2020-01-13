import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router'
import { Location } from '@angular/common'
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs'
import { setInputValue, click } from 'testing'
import { HeroDetailComponent } from './hero-detail.component'
import { HeroService } from 'app/shared/hero.service'
import { Hero } from 'app/shared/hero'

fdescribe('HeroDetailComponent imperative', () => {
  let fixture: ComponentFixture<HeroDetailComponent>
  let locationFake: Partial<Location>
  let heroServiceFake: Partial<HeroService>
  let paramMap$: ReplaySubject<ParamMap> = new ReplaySubject()
  let get$: ReplaySubject<Hero> = new ReplaySubject()
  let update$: ReplaySubject<Hero> = new ReplaySubject()

  function title(): HTMLElement {
    return fixture.nativeElement.querySelector('h2')
  }
  function idInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[name="id"]')
  }
  function nameInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[name="name"]')
  }
  function goBackButton(): HTMLElement {
    return fixture.nativeElement.querySelector('button#go-back')
  }
  function saveButton(): HTMLElement {
    return fixture.nativeElement.querySelector('button#save')
  }


  async function addHeroes() {
    paramMap$.next(convertToParamMap({ id: 10 }))
    get$.next({ id: 10, name: 'test' })

    get$.complete()

    fixture.detectChanges()
    await fixture.whenStable()
  }

  beforeEach(async () => {
    paramMap$ = new ReplaySubject()
    get$ = new ReplaySubject()
    update$ = new ReplaySubject()

    locationFake = {
      back: jest.fn()
    }

    heroServiceFake = {
      getHero: jest.fn().mockReturnValue(get$),
      updateHero: jest.fn().mockReturnValue(update$)
    }

    const activedRouteFake = {
      paramMap: paramMap$
    }

    TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      providers: [
        { provide: Location, useValue: locationFake },
        { provide: ActivatedRoute, useValue: activedRouteFake },
      ],
      imports: [
        FormsModule,

        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ]
    })

    TestBed.overrideProvider(HeroService, { useValue: heroServiceFake })

    fixture = TestBed.createComponent(HeroDetailComponent)

    fixture.autoDetectChanges()
    await fixture.whenStable()
  })

  afterEach(() => {
    paramMap$.unsubscribe()
    get$.unsubscribe()
    update$.unsubscribe()
    TestBed.resetTestingModule()
  })

  it('should display a hero', async () => {
    await addHeroes()

    expect(heroServiceFake.getHero).toHaveBeenCalledWith(10)

    expect(title().textContent.trim()).toEqual('TEST Details')

    expect(idInput()).not.toBeNull()
    expect(idInput().value).toEqual('10')
    expect(idInput().getAttribute('disabled')).toBeDefined()

    expect(nameInput()).not.toBeNull()
    expect(nameInput().value).toEqual('test')

    expect(saveButton()).not.toBeNull()
    expect(goBackButton()).not.toBeNull()
  })

  it('should display nothing by default', async () => {
    expect(heroServiceFake.getHero).not.toHaveBeenCalled()

    expect(title()).toBeNull()
    expect(idInput()).toBeNull()
    expect(nameInput()).toBeNull()
    expect(saveButton()).toBeNull()
    expect(goBackButton()).toBeNull()
  })

  describe('form', () => {
    it('do nothing without a name', async () => {
      await addHeroes()

      await setInputValue(fixture, nameInput(), '')

      expect(saveButton().getAttribute('disabled')).toEqual('true')

      await click(fixture, saveButton())

      expect(heroServiceFake.updateHero).not.toHaveBeenCalled()
      expect(locationFake.back).not.toHaveBeenCalled()
    })

    it('should do nothing with many spaces', async () => {
      await addHeroes()

      await setInputValue(fixture, nameInput(), '     ')

      expect(saveButton().getAttribute('disabled')).toBeNull()

      await click(fixture, saveButton())

      expect(heroServiceFake.updateHero).not.toHaveBeenCalled()
      expect(locationFake.back).not.toHaveBeenCalled()
    })

    it('submit sumbit form with good infos and go back', async () => {
      update$.next({ id: 10, name: 'new name' })
      await addHeroes()

      await setInputValue(fixture, nameInput(), 'new name')

      expect(saveButton().getAttribute('disabled')).toBeNull()

      await click(fixture, saveButton())

      expect(heroServiceFake.updateHero).toHaveBeenCalledWith({ id: 10, name: 'new name' })
      expect(locationFake.back).toHaveBeenCalled()
    })
  })

  describe('go back', () => {
    it('should save and go back', async () => {
      await addHeroes()

      await click(fixture, goBackButton())

      expect(locationFake.back).toHaveBeenCalled()
    })
  })
})
