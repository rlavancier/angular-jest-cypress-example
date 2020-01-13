import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard.component'
import { MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material'
import { HeroComponent } from './hero'

const routes = [
  { path: '', component: DashboardComponent },
]

@NgModule({
  declarations: [
    DashboardComponent,
    HeroComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),


    MatInputModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule { }
