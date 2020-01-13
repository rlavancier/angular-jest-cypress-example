import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HeroComponent } from './hero.component'
import { Component } from '@angular/core'
import { Hero } from 'app/shared/hero'
import { MatIconModule } from '@angular/material'
import { click } from 'testing'

@Component({
  template: `<app-hero [hero]="hero" (delete)="delete($event)"></app-hero>`
})
export class NoopComponent {
  public hero: Hero
  public delete: jest.Mock = jest.fn()
}

describe('HeroComponent', () => {
  function link(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('a')
  }
  function name(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('.name')
  }
  function id(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('.id')
  }
  function deleteButton(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('button.delete')
  }

  async function buildComponent(hero?: Hero) {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [
        NoopComponent,
        HeroComponent
      ],
      imports: [
        RouterTestingModule,

        MatIconModule
      ],
    })

    const fixture: ComponentFixture<NoopComponent> = TestBed.createComponent(NoopComponent)

    fixture.componentInstance.hero = hero

    fixture.autoDetectChanges()

    await fixture.whenStable()

    return {
      fixture,
      noopComponent: fixture.componentInstance
    }
  }

  it('should display nothing by default', async () => {
    const { fixture } = await buildComponent()

    expect(link(fixture)).toBeNull()
    expect(id(fixture)).toBeNull()
    expect(name(fixture)).toBeNull()
    expect(deleteButton(fixture)).toBeNull()
  })

  it('hould display a hero', async () => {
    const { fixture } = await buildComponent({
      id: 12,
      name: 'test'
    })

    expect(link(fixture)).not.toBeNull()
    expect(id(fixture).textContent.trim()).toEqual('12')
    expect(name(fixture).textContent.trim()).toEqual('test')
    expect(deleteButton(fixture)).not.toBeNull()
  })

  describe('delete', () => {
    it('should emit delete', async () => {
      const { fixture, noopComponent } = await buildComponent({
        id: 12,
        name: 'test'
      })

      await click(fixture, deleteButton(fixture))

      expect(noopComponent.delete).toHaveBeenCalledWith({
        id: 12,
        name: 'test'
      })
    })
  })
})
