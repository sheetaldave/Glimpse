import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { BsModalService } from 'ngx-bootstrap/modal';

import { MailContentModalComponent } from './mail-content-modal/mail-content-modal.component';
import { TopicsAnnotationsComponent } from './../topics-annotations/topics-annotations.component';
import { KnowledgeModalComponent } from './knowledge-modal/knowledge-modal.component';
import { AttachmentPreviewModalComponent } from './attachment-preview-modal/attachment-preview-modal.component';
import { MailEditorModalComponent } from './mail-editor-modal/mail-editor-modal.component';
import { MailMessage, Recipient } from './../mail-message';
import { Contact } from './../contact';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Injectable()
export class ModalService {

  private modalOptions = {
    animated: false,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
  };

  constructor(private modalService: BsModalService) { }

  topicsAnnotations(message: MailMessage): BsModalRef {
    const modal = this.modalService.show(TopicsAnnotationsComponent, this.modalOptions);
    modal.content.message = message;
    modal.content.modal = modal;
    return modal;
  }

  knowledgePanel(contact: Contact, message?: MailMessage): BsModalRef {
    const modal = this.modalService.show(KnowledgeModalComponent, this.modalOptions);
    modal.content.contact = contact;
    modal.content.message = message;
    modal.content.contactOnly = !message;
    modal.content.modal = modal;
    return modal;
  }

  mailContent(message: MailMessage): BsModalRef {
    const modal = this.modalService.show(MailContentModalComponent, this.modalOptions);
    modal.content.message = message;
    modal.content.modal = modal;
    return modal;
  }

  attachment(file: File): BsModalRef {
    if (!file) {
      return;
    }
    const modal = this.modalService.show(AttachmentPreviewModalComponent, this.modalOptions);
    modal.content.file = file;
    modal.content.modal = modal;
    return modal;
  }

  compose(action?: string, message?: MailMessage, contact?: any): BsModalRef {
    const modal = this.modalService.show(MailEditorModalComponent, this.modalOptions);
    modal.content.toContact = contact;
    if (action && message) {
      modal.content.replyMail(action, message);
    }
    modal.content.modal = modal;
    return modal;
  }

}
