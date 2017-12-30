import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../account/account.service";
import { AuthService } from '../../auth/auth.service';
import { Account } from "../../account/account";

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit {

  account: Account;
  loading: boolean = false;
  errorMessage: string;

  constructor(private accountService: AccountService,
              private authService: AuthService) { }

  ngOnInit() {
    this.accountService.getAccount()
      .subscribe(account => this.account = account)
  }

  googleSignIn($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.errorMessage = '';
    this.loading = true;
    this.authService.googleSignIn()
      .then( res => {
        this.accountService.getAccount(true)
          .subscribe(account => {
            this.loading = false;
            this.account = account;
          })
      })
      .catch( err => {
        this.loading = false;
        if (err === 'email_not_allowed') {
          this.errorMessage = 'Unfortunately, your email has not been authorized on our systems yet. \
          But don\'t worry, we are working hard to get people access.';
        } else {
          this.errorMessage = err;
        }
      });
  }

}
