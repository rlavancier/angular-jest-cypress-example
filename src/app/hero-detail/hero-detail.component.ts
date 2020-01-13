import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

import { Hero } from 'app/shared/hero'
import { HeroService } from 'app/shared/hero.service'
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero

  public readonly minName = 4
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => this.getHero(parseInt(params.get('id'), 0)))
  }

  public getHero(id: number): void {
    this.heroService.getHero(id)
      .pipe(finalize(() => this.changeDetectorRef.markForCheck()))
      .subscribe(hero => this.hero = hero)
  }

  public goBack(): void {
    this.location.back()
  }

 public save(): void {
    this.hero.name = this.hero.name.trim()

    if (this.hero.name.length >= this.minName)
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack())
  }
}
