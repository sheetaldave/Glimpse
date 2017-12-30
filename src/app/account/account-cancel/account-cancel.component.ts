import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-cancel',
  templateUrl: './account-cancel.component.html',
  styleUrls: ['./account-cancel.component.css'],
})
export class AccountCancelComponent implements OnInit {

  public errorMessage: string;
  public loading: boolean;

  constructor(private accountService: AccountService,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loading = false;
    this.errorMessage = '';
  }

  cancel() {
    this.loading = true;
    this.errorMessage = '';

    if (!confirm('Are you sure? The following action cannot be undone.')) {
      return;
    }

    this.accountService.cancel().subscribe(
      result => {
        this.loading = false;
        this.auth.signOut()
          .then(() => this.router.navigate(['signin']));
      },
      error => {
        this.loading = false;
        this.errorMessage = error.json().error;
      }
    );
  }
}
