import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Contact } from '../../contact';
import { MailMessage } from 'app/mail/mail-message';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-knowledge-modal',
  templateUrl: './knowledge-modal.component.html',
  styleUrls: ['./knowledge-modal.component.css']
})
export class KnowledgeModalComponent extends BaseModalComponent implements OnInit {

  @Input() contact: Contact;
  @Input() message: MailMessage;
  @Input() contactOnly: boolean;

  constructor(protected element: ElementRef, protected router: Router) {
    super(element, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.defaultSize();
  }

  defaultSize() {
    const modalContent = this.element.nativeElement.parentElement;
    modalContent.style.left = 'calc(50% - 300px)';
    modalContent.style.top = '3%';
    modalContent.style.width = '600px';
  }
}
