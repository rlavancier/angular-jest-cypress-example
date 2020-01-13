import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Hero } from 'app/shared/hero'
import { HeroService } from 'app/shared/hero.service'
import { MockComponent } from 'ng-mocks'
import { Observable, of, ReplaySubject, Subject } from 'rxjs'
import { click, setInputValue } from 'testing'
import { DashboardComponent } from './dashboard.component'
import { HeroComponent } from './hero'

describe('DashboardComponent', () => {
  function title(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('h1')
  }
  function addHeroInput(fixture: ComponentFixture<any>): HTMLInputElement {
    return fixture.nativeElement.querySelector('.add-hero input')
  }
  function addHeroButton(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('.add-hero button')
  }
  function heroes(fixture: ComponentFixture<any>): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('app-hero'))
  }
  function spinner(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('mat-spinner')
  }

  async function buildComponent(
    heroes$: Observable<Hero[]> = new Subject(),
    add$: Observable<Hero> = of(),
    delete$: Observable<Hero> = of()
    ) {
    const heroServiceFake = {
      getHeroes: jest.fn().mockReturnValue(heroes$),
      addHero: jest.fn().mockReturnValue(add$),
      deleteHero: jest.fn().mockReturnValue(delete$),
    }

    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockComponent(HeroComponent)
      ],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: HeroService, useValue: heroServiceFake },
      ]
    })

    const fixture: ComponentFixture<DashboardComponent> = TestBed.createComponent(DashboardComponent)

    fixture.autoDetectChanges()
    await fixture.whenStable()

    return {
      fixture,
      heroServiceFake,
    }
  }

  async function buildWithHeroes(params: { add$?: Observable<Hero>, delete$?: Observable<Hero> } = {} ) {
    const heroes$ = new ReplaySubject<Hero[]>()
    heroes$.next([
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
    ])
    heroes$.complete()

    return await buildComponent(heroes$, params.add$, params.delete$)
  }

  it('should create', async () => {
    const { fixture } = await buildComponent()

    expect(title(fixture).textContent.trim()).toEqual('Heroes')
    expect(addHeroInput(fixture)).toBeNull()
    expect(addHeroButton(fixture)).toBeNull()
    expect(heroes(fixture).length).toEqual(0)
    expect(spinner(fixture)).not.toBeNull()
  })

  it('should display heroes', async () => {
    const { fixture } = await buildWithHeroes()

    expect(addHeroInput(fixture)).not.toBeNull()
    expect(addHeroButton(fixture)).not.toBeNull()
    expect(heroes(fixture).length).toEqual(3)
    expect(spinner(fixture)).toBeNull()
  })

  describe('add', () => {
    it('should do nothing without a name', async () => {
      const { fixture, heroServiceFake } = await buildWithHeroes()

      await click(fixture, addHeroButton(fixture))

      expect(heroServiceFake.addHero).not.toHaveBeenCalled()
    })
    it('should do nothing with only spaces', async () => {
      const { fixture, heroServiceFake } = await buildWithHeroes()

      await setInputValue(fixture, addHeroInput(fixture), '    ')
      await click(fixture, addHeroButton(fixture))

      expect(heroServiceFake.addHero).not.toHaveBeenCalled()
    })

    it('should add hero', async () => {
      const add$ = new ReplaySubject<Hero>()
      const { fixture, heroServiceFake } = await buildWithHeroes({ add$ })

      await setInputValue(fixture, addHeroInput(fixture), 'test')
      await click(fixture, addHeroButton(fixture))

      add$.next({ id: 14, name: 'test' })
      add$.complete()
      fixture.detectChanges()

      expect(heroServiceFake.addHero).toHaveBeenCalledWith('test')
      expect(heroes(fixture).length).toEqual(4)

      add$.unsubscribe()
    })
  })

  describe('delete', () => {
    it('should do nothing without confirm', async () => {
      const { fixture, heroServiceFake } = await buildWithHeroes()
      const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)

      heroes(fixture)[1].componentInstance.delete.next({ id: 12, name: 'Narco' })

      expect(confirm).toHaveBeenCalledWith(`Do you really want to delete Narco ?`)

      expect(heroServiceFake.deleteHero).not.toHaveBeenCalled()
    })

    it('should call delete with confirm', async () => {
      const { fixture, heroServiceFake } = await buildWithHeroes()
      const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      heroes(fixture)[1].componentInstance.delete.next({ id: 12, name: 'Narco' })

      expect(confirm).toHaveBeenCalledWith(`Do you really want to delete Narco ?`)

      expect(heroServiceFake.deleteHero).toHaveBeenCalledWith({ id: 12, name: 'Narco' })
    })

    it('should reload heroes after delete', async () => {
      const delete$ = new ReplaySubject<Hero>()
      const { fixture, heroServiceFake } = await buildWithHeroes({ delete$ })
      const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      heroes(fixture)[1].componentInstance.delete.next({ id: 12, name: 'Narco' })

      expect(confirm).toHaveBeenCalledWith(`Do you really want to delete Narco ?`)

      delete$.next()
      delete$.complete()
      fixture.detectChanges()

      expect(heroServiceFake.getHeroes).toHaveBeenCalledTimes(2)
      delete$.unsubscribe()
    })
  })
})
