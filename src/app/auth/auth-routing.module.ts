import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { UnauthGuard } from './unauth-guard.service';

const authRoutes: Routes = [
  { path: 'signin',  canActivate: [UnauthGuard], component: SignInComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
