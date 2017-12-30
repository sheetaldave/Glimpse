import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  errorMessage: string = '';
  emailNotAllowed: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  googleSignIn() {
    this.errorMessage = '';
    this.emailNotAllowed = false;
    this.loading = true;
    this.authService.googleSignIn()
      .then( (isAccountReady: boolean) => {
        this.loading = false;
        if (isAccountReady) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['account/sync']);
        }
      })
      .catch( err => {
        this.loading = false;
        if (err === 'email_not_allowed') {
          this.emailNotAllowed = true;
        } else {
          this.errorMessage = err;
        }
      });
  }

}
