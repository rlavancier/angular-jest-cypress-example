import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoginComponent } from './login.component'
import { FormsModule } from '@angular/forms'
import { MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material'
import { RouterModule } from '@angular/router'

const routes = [
  { path: '', component: LoginComponent },
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,

    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class LoginModule { }
