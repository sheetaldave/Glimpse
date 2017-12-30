import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularSplitModule } from 'angular-split';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalModule, BsDropdownModule, AccordionModule, TabsModule, ButtonsModule, PopoverModule } from 'ngx-bootstrap';
import { DateTimePickerModule } from 'ngx-datetime-picker';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MailRoutingModule } from './mail-routing.module';
import { MailboxComponent } from './mailbox/mailbox.component';
import { MailService } from './mail.service';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailContentComponent } from './mail-content/mail-content.component';
import { MailSideBarComponent } from './mail-side-bar/mail-side-bar.component';
import { MailKnowledgeComponent } from './mail-knowledge/mail-knowledge.component';
import { MailBodyComponent } from './mail-body/mail-body.component';

import { ContactsService } from './contacts.service';
import { ContextMenuModule } from 'ngx-contextmenu/lib/ngx-contextmenu';
import { MailThreadComponent } from './mail-thread/mail-thread.component';
import { DndModule } from 'ng2-dnd';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { AvatarModule } from '../avatar.module';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { MailBulkActionsComponent } from './mail-bulk-actions/mail-bulk-actions.component';
import { MailDatePipe } from './mail-date.pipe';
import { AttachmentPreviewModalComponent } from './modals/attachment-preview-modal/attachment-preview-modal.component';
import { KnowledgeModalComponent } from './modals/knowledge-modal/knowledge-modal.component';
import { MailEditorModalComponent } from './modals/mail-editor-modal/mail-editor-modal.component';
import { ModalService } from './modals/modal.service';
import { KnowledgeGraphService } from './knowledge-graph.service';
import { TopicsAnnotationsComponent } from './topics-annotations/topics-annotations.component';
import { MailFolderDropdownComponent } from './mail-folder-dropdown/mail-folder-dropdown.component';
import { MailPaginationComponent } from './mail-pagination/mail-pagination.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ContactsCounterDropdownComponent } from './contacts-counter-dropdown/contacts-counter-dropdown.component';
import { MailContentModalComponent } from './modals/mail-content-modal/mail-content-modal.component';
import { BaseModalComponent } from './modals/base-modal/base-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MailRoutingModule,
    FormsModule,
    AngularSplitModule,
    InfiniteScrollModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),
    DateTimePickerModule,
    ContextMenuModule,
    DndModule.forRoot(),
    AvatarModule,
    NavBarModule,
    PdfViewerModule
  ],

  exports: [
    MailSideBarComponent, BaseModalComponent, MailListComponent, MailKnowledgeComponent, TextEditorComponent,
    MailDatePipe,  KnowledgeModalComponent, MailEditorModalComponent, AttachmentPreviewModalComponent
  ],

  declarations: [
    MailboxComponent, MailListComponent, MailContentComponent, MailSideBarComponent, MailBodyComponent,
    MailKnowledgeComponent, MailThreadComponent, TextEditorComponent,
    MailDatePipe, MailBulkActionsComponent, AttachmentPreviewModalComponent,
    KnowledgeModalComponent, MailEditorModalComponent, TopicsAnnotationsComponent,
    MailFolderDropdownComponent, MailPaginationComponent, MessageListComponent, ContactsCounterDropdownComponent,
    MailContentModalComponent, BaseModalComponent,
  ],

  providers: [
    MailService,
    ContactsService,
    MailDatePipe,
    DatePipe,
    ModalService,
    KnowledgeGraphService
  ],
  entryComponents: [
    TopicsAnnotationsComponent, KnowledgeModalComponent, AttachmentPreviewModalComponent,
    MailEditorModalComponent, MailContentModalComponent, BaseModalComponent
  ],
})
export class MailModule { }
