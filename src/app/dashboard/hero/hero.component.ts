import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core'
import { Hero } from 'app/shared/hero'

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  @Input()
  public hero: Hero

  @Output()
  public delete: EventEmitter<Hero> = new EventEmitter()

  public onDelete(): void {
    this.delete.emit(this.hero)
  }
}
