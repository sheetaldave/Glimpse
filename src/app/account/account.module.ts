import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularSplitModule } from 'angular-split';

import { AccountRoutingModule } from './account-routing.module';
import { AccountSideBarComponent } from './account-side-bar/account-side-bar.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { AccountComponent } from './account.component';
import { AccountService } from './account.service';
import { AccountSignatureComponent } from './account-signature/account-signature.component';
import { AccountQuickReplyTemplatesComponent } from './account-quick-reply-templates/account-quick-reply-templates.component';
import { AccountDelayedSendComponent } from './account-delayed-send/account-delayed-send.component';
import { AccountAutorepliesComponent } from './account-autoreplies/account-autoreplies.component';
import { AccountMailRulesComponent } from './account-mail-rules/account-mail-rules.component';

import { MailModule } from '../mail/mail.module';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { DateTimePickerModule } from 'ngx-datetime-picker';
import { AccountWebPushNotificationsComponent } from './account-web-push-notifications/account-web-push-notifications.component';
import { AccountCancelComponent } from './account-cancel/account-cancel.component';
import { AccountSyncMailsComponent } from './account-sync-mails/account-sync-mails.component';

@NgModule({
  imports: [
    CommonModule,
    MailModule,
    AccountRoutingModule,
    AngularSplitModule,
    FormsModule,
    DateTimePickerModule,
    NavBarModule
  ],
  declarations: [
    AccountSideBarComponent, AccountOverviewComponent, AccountComponent, AccountSignatureComponent,
    AccountQuickReplyTemplatesComponent, AccountDelayedSendComponent, AccountAutorepliesComponent,
    AccountMailRulesComponent, AccountWebPushNotificationsComponent, AccountCancelComponent, AccountSyncMailsComponent
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }
