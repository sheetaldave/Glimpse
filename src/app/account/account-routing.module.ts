import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { AccountComponent } from './account.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { AccountSignatureComponent } from './account-signature/account-signature.component';
import { AccountDelayedSendComponent } from './account-delayed-send/account-delayed-send.component';
import { AccountQuickReplyTemplatesComponent } from './account-quick-reply-templates/account-quick-reply-templates.component';
import { AccountAutorepliesComponent } from './account-autoreplies/account-autoreplies.component';
import { AccountMailRulesComponent } from './account-mail-rules/account-mail-rules.component';
import { AccountWebPushNotificationsComponent } from './account-web-push-notifications/account-web-push-notifications.component';
import { AccountCancelComponent } from './account-cancel/account-cancel.component';
import { AccountSyncMailsComponent } from './account-sync-mails/account-sync-mails.component';

const accountRoutes: Routes = [
  { path: 'account/sync',  canActivate: [AuthGuard], component: AccountSyncMailsComponent },
  {
    path: 'account', canActivate: [AuthGuard], component: AccountComponent, children: [
      { path: 'overview', canActivate: [AuthGuard], component: AccountOverviewComponent },
      { path: 'signatures', canActivate: [AuthGuard], component: AccountSignatureComponent },
      { path: 'delayed-send', canActivate: [AuthGuard], component: AccountDelayedSendComponent },
      { path: 'quick-reply-templates', canActivate: [AuthGuard], component: AccountQuickReplyTemplatesComponent },
      { path: 'auto-replies', canActivate: [AuthGuard], component: AccountAutorepliesComponent },
      { path: 'mail-rules', canActivate: [AuthGuard], component: AccountMailRulesComponent },
      { path: 'web-push-notifications', canActivate: [AuthGuard], component: AccountWebPushNotificationsComponent },
      { path: 'cancel', canActivate: [AuthGuard], component: AccountCancelComponent },
      { path: '', canActivate: [AuthGuard], redirectTo: '/account/overview', pathMatch: 'full' },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(accountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
