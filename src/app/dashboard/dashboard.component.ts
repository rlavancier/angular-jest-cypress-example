import { Component, OnInit } from '@angular/core'

import { HeroService } from 'app/shared/hero.service'
import { Hero } from 'app/shared/hero'
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  public isLoading = true
  public heroes: Hero[]

  constructor(private heroService: HeroService) {}

  public ngOnInit(): void {
    this.getHeroes()
  }

  public getHeroes(): void {
    this.isLoading = true

    this.heroService.getHeroes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(heroes => this.heroes = heroes)
  }

  public add(name: string): void {
    const heroName = name.trim()
    if (!heroName) return

    this.heroService.addHero(heroName)
      .subscribe(hero => this.heroes.push(hero))
  }

  public delete(hero: Hero): void {
    const confirm = window.confirm(`Do you really want to delete ${hero.name} ?`)

    if (confirm)
      this.heroService.deleteHero(hero)
        .subscribe(() => this.getHeroes())
  }
}
