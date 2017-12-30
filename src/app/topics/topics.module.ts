import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AngularSplitModule } from 'angular-split';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './topics/topics.component';
import { TopicsRoutingModule } from './topics-routing.module';
import { TopicsMapComponent } from './topics-map/topics-map.component';
import { TopicsService } from "./topics.service";
import { TooltipModule, BsDropdownModule } from 'ngx-bootstrap';
import { MailModule } from "../mail/mail.module";
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { TopicSidebarMailsContactsComponent } from "./topic-sidebar-mails-contacts/topic-sidebar-mails-contacts.component";
import { TopicRelatedMailsListComponent } from "./topic-related-mails-list/topic-related-mails-list.component";
import { AvatarModule } from "../avatar.module";
import { TopicSideBarComponent } from './topic-side-bar/topic-side-bar.component';
import { DndModule } from 'ng2-dnd';
import { ContextMenuModule } from 'ngx-contextmenu/lib/ngx-contextmenu';
import { SearchModule } from "../search/search.module";
import { ModalService } from '../mail/modals/modal.service';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

@NgModule({
  imports: [
    FormsModule,
    AngularSplitModule,
    InfiniteScrollModule,
    CommonModule,
    MailModule,
    TopicsRoutingModule,
    TooltipModule.forRoot(),
    DndModule.forRoot(),
    ContextMenuModule,
    AvatarModule,
    SearchModule,
    BsDropdownModule.forRoot(),
    NavBarModule
  ],
  declarations: [TopicsComponent, TopicSidebarMailsContactsComponent, TopicsMapComponent, TopicRelatedMailsListComponent, TopicSideBarComponent, ComingSoonComponent],
  providers: [
    TopicsService,
    ModalService
  ],
})
export class TopicsModule { }
