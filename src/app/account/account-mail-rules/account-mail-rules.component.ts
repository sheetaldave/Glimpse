import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account.service';

import {AccountMailRule} from '../account-mail-rule';

@Component({
  selector: 'app-account-mail-rules',
  templateUrl: './account-mail-rules.component.html',
  styleUrls: ['./account-mail-rules.component.css']
})
export class AccountMailRulesComponent implements OnInit {
  loading: boolean;
  saved: boolean;
  errorMessage: string;
  showForm: boolean;
  mailRules: AccountMailRule[];
  inputObject;


  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.inputObject = {};
    this.loading = false;
    this.saved = false;
    this.errorMessage = '';
    this.showForm = false;
    this.mailRules = [];

    this.accountService.getMailRules()
      .subscribe(
        response => {
          this.mailRules = response;
        },
        error => this.errorMessage = error
      );
  }

  openForm(mailRule?) {
    this.closeForm();

    if (mailRule) {
      this.inputObject.id = mailRule.id;
      this.inputObject.title = mailRule.title;
      this.inputObject.conditionName = mailRule.conditionName;
      this.inputObject.conditionRule = mailRule.conditionRule;
      this.inputObject.conditionValue = mailRule.conditionValue;
      this.inputObject.actionName = mailRule.actionName;
      this.inputObject.actionValue = mailRule.actionValue;
    }

    this.showForm = true;

    window.scrollTo(0, 0);
  }

  closeForm() {
    this.showForm = false;

    this.inputObject.id = '';
    this.inputObject.title = '';
    this.inputObject.conditionName = '';
    this.inputObject.conditionRule = '';
    this.inputObject.conditionValue = '';
    this.inputObject.actionName = '';
    this.inputObject.actionValue = '';
  }

  _onSuccess(result: any) {
    this.loading = false;
    this.saved = result['success'];
    if (!result['success']) {
      this.errorMessage = result['error'];
    }

    this.accountService.getMailRules()
      .subscribe(
        response => {
          this.mailRules = response;
        },
        error => this.errorMessage = error
      );

    this.closeForm();
  }

  _onError(error: any) {
    this.loading = false;
    this.saved = false;
    this.errorMessage = error;

    this.closeForm();
  }

  saveRule() {
    this.loading = true;
    this.saved = false;
    this.errorMessage = '';

    if (this.inputObject.id) {
      this.accountService.updateMailRule(this.inputObject.id, this.inputObject)
        .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
    } else {
      this.accountService.createMailRule(this.inputObject)
        .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
    }
  }

  deleteRule(id) {
    this.loading = true;
    this.saved = false;
    this.errorMessage = '';
    this.accountService.removeMailRule(id)
      .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
  }

}
