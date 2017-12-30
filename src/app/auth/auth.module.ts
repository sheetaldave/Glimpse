import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../environments/environment';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { GoogleApiService } from './google-api.service';
import { GoogleAuthService } from './google-auth.service';
import { AuthGuard } from './auth-guard.service';
import { UnauthGuard } from './unauth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
  ],
  declarations: [SignInComponent],
  providers: [
    GoogleApiService,
    GoogleAuthService,
    AuthService,
    AuthGuard,
    UnauthGuard
  ]
})
export class AuthModule { }
