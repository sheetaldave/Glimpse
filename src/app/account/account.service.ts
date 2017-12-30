import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Account } from './account';
import { AccountQuickReplyTemplates } from './account-quick-reply-templates';
import { AccountMailRule } from './account-mail-rule';

import { AutoReply } from './auto-reply';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { AccountSignature } from './account-signature';


@Injectable()
export class AccountService {

  accountSubject: ReplaySubject<Account>;
  account: Account;
  autoReply: AutoReply;
  mailRules: AccountMailRule[];
  quickReplyTemplates: AccountQuickReplyTemplates[];
  signatures: AccountSignature[];

  constructor(private authHttp: AuthHttp) {
    this.accountSubject = new ReplaySubject<Account>(1);
  }

  getAccount(force: boolean = false): ReplaySubject<Account> {
    if (force || !this.account){
      this.authHttp.get(environment.baseUrl+"/api/account").subscribe(
        response => {
          this.account = response.json() as Account;
          this.accountSubject.next(this.account);
        },
        error => {
          console.log(error)
          this.account = null;
          this.accountSubject.next({} as Account);
        }
      )
    }
    return this.accountSubject;
  }

  getSignatures(force: boolean = false): Observable<AccountSignature[]> {
    if (this.signatures && !force) {
      return Observable.of(this.signatures)
    }

    return this.authHttp.get(environment.baseUrl + "/api/account/signatures").map(
      response => {
        const data = response.json();
        this.signatures = data['signatures'];
        return this.signatures;
      }
    )
  }

  saveSignature(signature, isDefault? : boolean): Observable<{ success: boolean, data: AccountSignature }> {
    if (!signature.hasOwnProperty('id')) {
      return this.authHttp.post(environment.baseUrl + '/api/account/signatures', {signature: signature})
        .map(response => response.json());
    } else {
      if (isDefault) {
        signature.isDefault = true;
      }
      return this.authHttp.put(environment.baseUrl + '/api/account/signatures/' + signature.id, { signature: signature } )
        .map(response => response.json());
    }
  }

  removeSignature(signatureId: string): Observable<boolean> {
    return this.authHttp.delete(environment.baseUrl + '/api/account/signatures/' + signatureId)
      .map(response => response.json())
  }

  getDelayedSend(): Observable<boolean> {
    return this.authHttp.get(environment.baseUrl + '/api/account/delayed-send').map(
      response => {
        const data = response.json();
        return data['enabled'] || false;
      }
    );
  }

  saveDelayedSend(value): Observable<object> {
    return this.authHttp.post(environment.baseUrl + '/api/account/delayed-send', {enabled: value}).map(
      response => response.json()
    );
  }

  getQuickReplyTemplates(): Observable<AccountQuickReplyTemplates[]> {
    return this.authHttp.get(environment.baseUrl + '/api/account/quick-reply-templates').map(
      response => {
        this.quickReplyTemplates = response.json().quickReplyTemplates || [];
        return this.quickReplyTemplates;
      }
    );
  }

  createQuickReplyTemplate(title, content): Observable<object> {
    return this.authHttp.post(
      environment.baseUrl + '/api/account/quick-reply-templates',
      {title, content}).map(
      response => response.json()
    );
  }

  updateQuickReplyTemplate(id, title, content): Observable<object> {
    return this.authHttp.put(
      environment.baseUrl + '/api/account/quick-reply-templates/' + id,
      {title, content}).map(
      response => response.json()
    );
  }

  removeQuickReplyTemplate(id): Observable<object> {
    return this.authHttp.delete(environment.baseUrl + '/api/account/quick-reply-templates/' + id).map(
      response => response.json()
    );
  }

  getMailRules(): Observable<AccountMailRule[]> {
    return this.authHttp.get(environment.baseUrl + '/api/account/mail-rules').map(
      response => {
        this.mailRules = response.json().data.mailRules || [];
        return this.mailRules;
      }
    );
  }

  createMailRule(rule) {
    return this.authHttp.post(
      environment.baseUrl + '/api/account/mail-rules',
      rule
    ).map(
      response => response.json()
    );
  }

  updateMailRule(id, rule): Observable<object> {
    return this.authHttp.put(
      environment.baseUrl + '/api/account/mail-rules/' + id,
      rule
    ).map(
      response => response.json()
    );
  }

  removeMailRule(id): Observable<object> {
    return this.authHttp.delete(environment.baseUrl + '/api/account/mail-rules/' + id).map(
      response => response.json()
    );
  }

  getAutoReply(): Observable<AutoReply> {
    return this.authHttp.get(environment.baseUrl + '/api/account/auto-reply').map(
      response => {
        const data = response.json();

        this.autoReply = {
          content: data['autoReply'].content || '',
          dateFrom: data['autoReply'].dateFrom || null,
          dateTo: data['autoReply'].dateTo || null,
        };

        return this.autoReply;
      }
    );
  }

  saveAutoReply(autoReply): Observable<object> {
    return this.authHttp.post(environment.baseUrl + '/api/account/auto-reply', autoReply).map(
      response => response.json()
    );
  }

  cancel(): Observable<object> {
    return this.authHttp.delete(environment.baseUrl + '/api/account').map(
      response => response.json()
    );
  }

  isAccountReady(): Observable<boolean> {
    return this.authHttp.get(environment.baseUrl + '/api/account/ready').map(
      response => {
        const data = response.json();
        return data['account_ready'] || false;
      }
    );
  }

}
