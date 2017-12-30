import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MailMessage, Recipient } from '../../mail-message';
import { ModalService } from '../modal.service';
import { MailTopic } from 'app/mail/mail-topic';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-mail-content-modal',
  templateUrl: './mail-content-modal.component.html',
  styleUrls: ['./mail-content-modal.component.less'],
})
export class MailContentModalComponent extends BaseModalComponent implements OnInit {

  @Input() message: MailMessage;
  isShowKnowledgePanel: boolean = false;
  selectedTopic: MailTopic;
  selectedContact: Recipient;

  constructor(protected element: ElementRef, protected router: Router) {
    super(element, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.defaultSize();
  }

  onReplayMessage(modal: BsModalRef) {
    const modalContent = this.element.nativeElement.parentElement;
    if (modalContent) {
      modal.content.frame = {
        width: `${modalContent.offsetWidth}px`,
        height: `${modalContent.offsetHeight}px`,
        x: `${modalContent.offsetLeft}px`,
        y: `${modalContent.offsetTop}px`
      };
    }
    this.close();
  }

  defaultSize() {
    const modalContent = this.element.nativeElement.parentElement;
    modalContent.style.left = 'calc(50% - 500px)';
    modalContent.style.top = '40px';
    modalContent.style.width = '1000px';
    modalContent.style.height = 'calc(100% - 100px)';
  }
}
