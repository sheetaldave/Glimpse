import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-sync-mails',
  templateUrl: './account-sync-mails.component.html',
  styleUrls: ['./account-sync-mails.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSyncMailsComponent implements OnInit {

  checkInterval = 30000;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.checkAccountReady();
  }

  private checkAccountReady() {
    this.accountService.isAccountReady()
    .subscribe(
      account_ready => {
        if (account_ready) {
          this.router.navigate(['']);
        } else {
          setTimeout(() => this.checkAccountReady(), this.checkInterval);
        }
      },
      () => {
        setTimeout(() => this.checkAccountReady(), this.checkInterval);
      }
    );
  }

}
