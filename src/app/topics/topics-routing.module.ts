import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

const topicsRoutes: Routes = [
  { path: 'insights', canActivate: [AuthGuard], component: ComingSoonComponent },
  { path: 'insights/:folder/:type/:query', canActivate: [AuthGuard], component: ComingSoonComponent },
  { path: 'insights/:folder', canActivate: [AuthGuard], component: ComingSoonComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(topicsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TopicsRoutingModule { }
