import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class UnauthGuard {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (!this.auth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
