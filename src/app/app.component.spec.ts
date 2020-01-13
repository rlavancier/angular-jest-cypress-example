import { TestBed, async } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { MatToolbarModule } from '@angular/material'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    })
  }))

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.autoDetectChanges()

    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('mat-toolbar-row').textContent.trim()).toEqual('Testing app')
  })
})
