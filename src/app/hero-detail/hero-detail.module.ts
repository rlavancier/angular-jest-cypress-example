import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HeroDetailComponent } from './hero-detail.component'
import { FormsModule } from '@angular/forms'
import { MatInputModule, MatFormFieldModule, MatButtonModule } from '@angular/material'

const routes = [
  { path: '', component: HeroDetailComponent },
]

@NgModule({
  declarations: [
    HeroDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class HeroDetailModule { }
