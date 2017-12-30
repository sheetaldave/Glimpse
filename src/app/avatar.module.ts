/**
 * Created by incode-pc6 on 03.08.17.
 */
import { NgModule } from '@angular/core';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { PopoverModule } from 'ngx-bootstrap';
import { ContextMenuModule } from 'ngx-contextmenu/lib/ngx-contextmenu';
import { ModalService } from './mail/modals/modal.service';

@NgModule({
  declarations: [
    UserAvatarComponent
  ],
  exports: [UserAvatarComponent],
  imports: [
    PopoverModule.forRoot(),
    ContextMenuModule
  ],
  providers: [
    ModalService
  ]
})
export class AvatarModule { }
