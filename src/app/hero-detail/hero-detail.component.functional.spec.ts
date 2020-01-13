import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router'
import { Location } from '@angular/common'
import { Observable, Subject, BehaviorSubject } from 'rxjs'
import { setInputValue, click } from 'testing'
import { HeroDetailComponent } from './hero-detail.component'
import { HeroService } from 'app/shared/hero.service'
import { Hero } from 'app/shared/hero'

describe('HeroDetailComponent functional', () => {
  function title(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('h2')
  }
  function idInput(nativeElement: HTMLElement): HTMLInputElement {
    return nativeElement.querySelector('input[name="id"]')
  }
  function nameInput(nativeElement: HTMLElement): HTMLInputElement {
    return nativeElement.querySelector('input[name="name"]')
  }
  function goBackButton(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('button#go-back')
  }
  function saveButton(nativeElement: HTMLElement): HTMLElement {
    return nativeElement.querySelector('button#save')
  }

  async function buildComponent(
    paramMap$: Observable<ParamMap> = new Subject(),
    get$: Observable<Hero> = new Subject(),
    update$: Observable<Hero> = new Subject()
  ) {
    const locationFake = {
      back: jest.fn()
    }

    const heroServiceFake = {
      getHero: jest.fn().mockReturnValue(get$),
      updateHero: jest.fn().mockReturnValue(update$),
    }

    const activedRouteFake = {
      paramMap: paramMap$
    }

    TestBed.resetTestingModule()
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

    const fixture: ComponentFixture<HeroDetailComponent> = TestBed.createComponent(HeroDetailComponent)

    fixture.autoDetectChanges()

    await fixture.whenStable()

    return {
      fixture,
      locationFake,
      heroServiceFake,
    }
  }

  async function buildWithHero(update$?: Observable<Hero>) {
    const queryMap$ = new BehaviorSubject<ParamMap>(convertToParamMap({ id: 10 }))
    const get$ = new BehaviorSubject<Hero>({ id: 10, name: 'test' })

    const res =  await buildComponent(queryMap$, get$, update$)

    queryMap$.complete()
    get$.complete()

    return res
  }

  it('should display nothing by default', async () => {
    const { fixture, heroServiceFake } = await buildComponent()

    expect(heroServiceFake.getHero).not.toHaveBeenCalled()

    expect(title(fixture.nativeElement)).toBeNull()
    expect(idInput(fixture.nativeElement)).toBeNull()
    expect(nameInput(fixture.nativeElement)).toBeNull()
    expect(saveButton(fixture.nativeElement)).toBeNull()
    expect(goBackButton(fixture.nativeElement)).toBeNull()
  })


  describe('form', () => {
    it('do nothing without a name', async () => {
      const { fixture, heroServiceFake, locationFake } = await buildWithHero()

      await setInputValue(fixture, nameInput(fixture.nativeElement), '')

      expect(saveButton(fixture.nativeElement).getAttribute('disabled')).toEqual('true')

      await click(fixture, saveButton(fixture.nativeElement))

      expect(heroServiceFake.updateHero).not.toHaveBeenCalled()
      expect(locationFake.back).not.toHaveBeenCalled()
    })

    it('should do nothing with many spaces', async () => {
      const { fixture, heroServiceFake, locationFake } = await buildWithHero()

      await setInputValue(fixture, nameInput(fixture.nativeElement), '     ')

      expect(saveButton(fixture.nativeElement).getAttribute('disabled')).toBeNull()

      await click(fixture, saveButton(fixture.nativeElement))

      expect(heroServiceFake.updateHero).not.toHaveBeenCalled()
      expect(locationFake.back).not.toHaveBeenCalled()
    })

    it('submit sumbit form with good infos and go back', async () => {
      const update$ = new BehaviorSubject<Hero>({ id: 10, name: 'new name' })
      const { fixture, heroServiceFake, locationFake } = await buildWithHero(update$)

      await setInputValue(fixture, nameInput(fixture.nativeElement), 'new name')

      expect(saveButton(fixture.nativeElement).getAttribute('disabled')).toBeNull()

      await click(fixture, saveButton(fixture.nativeElement))

      expect(heroServiceFake.updateHero).toHaveBeenCalledWith({ id: 10, name: 'new name' })
      expect(locationFake.back).toHaveBeenCalled()
    })
  })

  describe('go back', () => {
    it('should save and go back', async () => {
      const { fixture, locationFake } = await buildWithHero()

      await click(fixture, goBackButton(fixture.nativeElement))

      expect(locationFake.back).toHaveBeenCalled()
    })
  })
})
