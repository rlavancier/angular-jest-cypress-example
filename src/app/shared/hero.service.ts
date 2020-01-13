import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Hero } from './hero'

@Injectable({ providedIn: 'root' })
export class HeroService {
  private url = 'api/heroes'

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) {}

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.url)
  }

  public getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.url}/${id}`)
  }

  public addHero(name: string): Observable<Hero> {
    return this.http.post<Hero>(this.url, { name }, this.httpOptions)
  }

  public deleteHero(hero: Hero): Observable<Hero> {
    return this.http.delete<Hero>(`${this.url}/${hero.id}`, this.httpOptions)
  }

  public updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.url, hero, this.httpOptions)
  }
}
