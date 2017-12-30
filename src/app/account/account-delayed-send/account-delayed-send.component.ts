import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-delayed-send',
  templateUrl: './account-delayed-send.component.html',
  styleUrls: ['./account-delayed-send.component.css']
})
export class AccountDelayedSendComponent implements OnInit {
  loading: boolean;
  saved: boolean;
  errorMessage: string;
  enabled: boolean;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.loading = false;
    this.saved = false;
    this.errorMessage = '';
    this.enabled = false;
    this.accountService.getDelayedSend()
      .subscribe(
        enabled => {
          this.enabled = enabled;
        },
        error => this.errorMessage = error
      );
  }

  saveDelayedSend() {
    this.loading = true;
    this.saved = false;
    this.errorMessage = '';
    this.accountService.saveDelayedSend(this.enabled)
      .subscribe(
        result => {
          this.loading = false;
          this.saved = result['success'];
          if (!result['success']) {
            this.errorMessage = result['error'];
          }
        },
        error => {
          this.loading = false;
          this.saved = false;
          this.errorMessage = error;
        }
      );
  }

}
