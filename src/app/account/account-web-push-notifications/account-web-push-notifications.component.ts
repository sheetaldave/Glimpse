import { Component, OnInit } from '@angular/core';

import { Account } from '../account';
import { AccountService } from '../account.service';
import { PushNotificationsService } from '../../push-notifications.service';


@Component({
  selector: 'app-account-web-push-notifications',
  templateUrl: './account-web-push-notifications.component.html',
  styleUrls: ['./account-web-push-notifications.component.css']
})
export class AccountWebPushNotificationsComponent implements OnInit {

  private account: Account;

  public enabled: boolean;
  public isSupported: boolean;
  public permission: string;

  constructor(private accountService: AccountService,
              private pushNotifications: PushNotificationsService) {

  }

  ngOnInit() {
    this.accountService.getAccount()
      .subscribe(account => this.account = account);

    this.isSupported = this.pushNotifications.isSupported();

    if (this.isSupported) {
      this.getCurrentPermission();

      this.pushNotifications.isEnabled()
        .then(isEnabled => this.enabled = isEnabled)
        .catch(error => this.enabled = false);
    }
  }

  getCurrentPermission(): void {
    this.pushNotifications.getPermission()
      .then(permission => {
        this.permission = permission;
        return permission;
      })
      .catch(error => {
        console.error(error);
      });
  }

  grantPermission() {
    if (this.permission === this.pushNotifications.PERMISSION_DEFAULT) {
      this.pushNotifications.register();
    }
    this.pushNotifications.setUser(this.account.id);
  }

  enableSubscription() {
    this.pushNotifications.enableNotifications();
    this.enabled = true;
  }

  disableSubscription() {
    this.pushNotifications.disableNotifications();
    this.enabled = false;
  }

}
