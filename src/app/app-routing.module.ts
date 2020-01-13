import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink'

const routes: Routes = [
  { path: '',            redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',       loadChildren: () => import('./login').then(mod => mod.LoginModule) },
  { path: 'dashboard',   loadChildren: () => import('./dashboard').then(mod => mod.DashboardModule) },
  { path: 'detail/:id',  loadChildren: () => import('./hero-detail').then(mod => mod.HeroDetailModule) }
]

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
