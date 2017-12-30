import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { MailboxComponent } from './mailbox/mailbox.component'

const mailRoutes: Routes = [
  { path: 'mail/:folder/:type/:query', canActivate: [AuthGuard], component: MailboxComponent },
  { path: 'mail/search', canActivate: [AuthGuard], redirectTo: '/mail/inbox' },
  { path: 'mail/:folder', canActivate: [AuthGuard], component: MailboxComponent },
  { path: 'mail', canActivate: [AuthGuard], redirectTo: '/mail/inbox', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forChild(mailRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MailRoutingModule { }
