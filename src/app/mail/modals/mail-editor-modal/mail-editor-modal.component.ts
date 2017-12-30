import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MailService } from '../../mail.service';
import { ContactsService } from '../../contacts.service';
import { AccountService } from '../../../account/account.service';
import { MailDatePipe } from '../../mail-date.pipe';
import { MailMessage, Recipient } from '../../mail-message';
import { Contact } from '../../contact';
import { Account } from '../../../account/account';
import { AccountQuickReplyTemplates } from '../../../account/account-quick-reply-templates';
import { AccountSignature } from '../../../account/account-signature';
import { GoogleAnalyticsService } from '../../../google-analytics.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BaseModalComponent } from '../base-modal/base-modal.component';

class ModalFrame {
  width: string;
  height: string;
  x: string;
  y: string;
}

@Component({
  selector: 'app-mail-editor-modal',
  templateUrl: './mail-editor-modal.component.html',
  styleUrls: ['./mail-editor-modal.component.css']
})
export class MailEditorModalComponent extends BaseModalComponent implements OnInit, OnDestroy {

  // Common properties for all modals
  @Input() toContact: any;
  _frame: ModalFrame = {
    width: '700px',
    height: '500px',
    x: 'calc(100% - 705px)',
    y: 'calc(100% - 505px)'
  };
  @Input()
  set frame(frame: ModalFrame) {
    if (this._frame !== frame) {
      this._frame = frame;
      this.updateModalSize();
    }
  }
  get frame(): ModalFrame {
    return this._frame;
  }
  component: string;
  contacts: Contact[] = [];

  // Special properties for 'modal-editor'-modal
  modalTitle: string;
  from: Account;
  cachedContacts: Contact[] = [];
  to: Recipient[] = [];
  cc: Recipient[]  = [];
  bcc: Recipient[]  = [];
  sending: boolean = false;
  cancelling: boolean = false;
  cancelMessageJobId: string;
  cancelMessageTimeoutId: number;
  saving: boolean = false;
  file_ids: Array<string> = [];
  attachments: Array<any> = [];
  attachmentUploading: boolean = false;
  errorMessage: string;
  showCc: boolean  = false;
  showBcc: boolean  = false;
  showCalendar: boolean = false;
  allowSaving:boolean = false;
  searchQueryTo: string;
  searchQueryCc: string;
  searchQueryBcc: string;
  messageTxt: string = ''; // should be defined because undefined brake fillBody method.
  subject: string;
  openNestedDropdown: string;
  emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  signatures: AccountSignature[];
  selectedSignature: AccountSignature;
  quickReplyTemplates: AccountQuickReplyTemplates[];
  initialReplyTemplate: string = '';
  replied: boolean = false;
  forwarded: boolean = false;
  replyToMessageId: string;
  threadId: string;

  private _messageTemplates = {
    new: '<br/>{{signature}}<br/>',
    reply: '<br/>{{signature}}<br/>{{name}} [{{email}}]: {{sentTime}}<br/><blockquote>{{body}}</blockquote><br/>',
    forward: '<br/>{{signature}}<br/>{{name}} [{{email}}]: {{sentTime}}<br/><blockquote>{{body}}</blockquote><br/>',
  };

  public selectedDateTime: Date;

  constructor(
    private accountService: AccountService,
    private mailService: MailService,
    private contactsService: ContactsService,
    private mailDatePipe: MailDatePipe,
    protected ga: GoogleAnalyticsService,
    protected element: ElementRef,
    protected router: Router
  ) {
    super(element, router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.modalTitle = 'Compose New Message';
    this.sending = false;
    this.getMyAccount();
    this.getSignatures();
    this.getQuickReplyTemplates();
    this.getMyContacts();
    this.updateModalSize();
  }

  ngOnDestroy() {
    this.toContact = '';
    this.to = [];
    this.cc = [];
    this.bcc = [];
    this.file_ids = [];
    this.subject = '';
    this.messageTxt = '';
    this.initialReplyTemplate = '';
    this.threadId = '';
    this.replyToMessageId = '';
    this.showCc = false;
    this.showBcc = false;
    this.cancelMessageJobId = null;
    this.cancelling = false;
    this.showCalendar = false;
    this.replied = false;
    this.forwarded = false;
    clearTimeout(this.cancelMessageTimeoutId);
    this.cancelMessageTimeoutId = null;
    this.selectedDateTime = null;
    this.attachments = [];
  }

  updateModalSize() {
    const modalContent = this.element.nativeElement.parentElement;
    modalContent.style.left = this.frame.x;
    modalContent.style.top = this.frame.y;
    modalContent.style.width = this.frame.width;
    modalContent.style.height = this.frame.height;
  }

  /**
   * Get my Account
   */
  getMyAccount(): void{
    this.accountService.getAccount()
      .subscribe(
        data => this.from = data,
        err => console.error(err)
      );
  }

  /**
   * Get Contacts of My Account
   */
  getMyContacts(): void{
    this.contactsService.getContacts()
      .then(response => {
        this.contacts = response.contacts;
        this.cachedContacts = response.contacts;
      });
  }

  /**
   * Select contact in dropdown from auto-suggestions
   * @param list     'To'/'Cc'/'Bcc'
   * @param contact  Instance of Account interface
   * @param input    html form field
   */
  selectContact(list, contact: {name: string, email: string}, input?): void{
    switch (list) {
      case 'to':
        this.to.push(contact);
        this.searchQueryTo = '';
        break;
      case 'cc':
        this.cc.push(contact)
        this.searchQueryCc = '';
        break;
      case 'bcc':
        this.bcc.push(contact);
        this.searchQueryBcc = '';
        break;
      default:
        break;
    }
    this.allowSave();
    input.focus();
  }

  /**
   * Remove contact from input
   * @param list     'To'/'Cc'/'Bcc'
   * @param contact  Instance of Account interface
   * @param input    html form field
   */
  removeContact(list, contact, input?): void{
    if (list.length === 0){
      this.toContact = '';
    }
    list.splice(list.indexOf(contact), 1);
    input.focus();
  }

  useQuickReplyTemplate(replyTemplate) {
    this.messageTxt = replyTemplate.content + this.initialReplyTemplate;
    this.ga.trackEvent('quick-reply', 'quick-reply-template');
  }

  /**
   * Send mail message and hide modal after
   */
  sendMail(): void{
    this.ga.trackEvent('mail-action', 'send-email');
    this.sending = true;
    this.allowSaving = false;

    if (this.to.length < 1) {
      this.to.push({ name: '', email: this.searchQueryTo })
    }

    const followUpEmail = this.selectedDateTime
      ? this.selectedDateTime.getTime()
      : null;

    const mail = {
      body: this.messageTxt,
      from: [this.from],
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      file_ids: this.file_ids,
      subject: this.subject,
      thread_id: this.threadId,
      follow_up: followUpEmail,
      replied: this.replied,
      forwarded: this.forwarded,
      reply_to_message_id: this.replyToMessageId,
    };

    this.mailService.sendMessage(mail)
      .then(data => {
        if (data.delay_send_job_id) {
          this.cancelMessageJobId = data.delay_send_job_id;
          this.cancelMessageTimeoutId = window.setTimeout(() => {
            this.close();
          }, 45000);
        } else {
          this.sending = false;
          this.close();
        }
      })
      .catch(error => {
        this.sending = false;
        console.error(error);
        this.errorMessage = error.message;
        this.saveMessageToDrafts();
      });
  }

  cancelMail(): void {
    this.cancelling = true;

    this.mailService.cancelMessage(this.cancelMessageJobId)
      .then(result => {
        this.cancelling = false;
        this.cancelMessageJobId = null;
        this.close();
      })
      .catch(error => {
        console.error(error);
      });

  }

  /**
   * Show 'Save to Drafts' button and allow to save on close modal
   */
  allowSave(): void{
    this.allowSaving = true;
  }

  /**
   * Save message to drafts and hide the modal
   */
  saveMessageToDrafts(): void{
    if (this.allowSaving && !this.sending) {
      this.saving = true;
      let mail = {
        body: this.messageTxt,
        from: [this.from],
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        file_ids: this.file_ids,
        subject: this.subject
      };
      this.mailService.saveMessageToDrafts(mail)
        .then(response => {
          setTimeout(() => {
            this.saving = false;
            this.close();
          }, 1000);
        })
    } else {
      this.close();
    }
    this.allowSaving = false;
  }

  /**
   * Search in dropdown auto-suggestion for a contact
   * @param query : string
   * @param e     : event
   * @param list  : 'To'/'Cc'/'Bcc'
   * @param input : html-input to toggle
   * @param toggle: html-element to toggle dropdown
   */
  search(query: string, e, list: string, input, toggle): void {
    if (!this.toContact) {
      if (e.keyCode === 9 || e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 20
        || ( e.keyCode > 32 && e.keyCode < 41 )) {
        return;
      }

      if (query && query.length < 1 && e.keyCode === 8) {
        return;
      }
    }

    if (e.keyCode === 32 || e.keyCode === 13) {
      if (this.emailRegExp.test(query)) {
        this.selectContact(list, {name: '', email: query}, input);
        input.focus();
        this.modalTitle = '';
      } else {
        this.modalTitle = 'please provide a valid email';
      }
    }

    this.getAndFilterContacts(query);

    if (query.length === 2 && this.contacts.length > 0) {
      this.triggerInput(toggle);
    }
  }

  /**
   * Filter shown contacts by query
   * @param query: string
   */
  getAndFilterContacts (query: string) {
    if (this.contacts.length < 1) {
      this.contacts = this.cachedContacts;
    }

    if (query.length < 2) {
      this.contacts = [];
    } else {
      this.contacts = [];
      this.cachedContacts.forEach(contact => {
        if (contact.email.includes(query.toLowerCase()) ||
          (contact.name ? contact.name.toLowerCase().includes(query.toLowerCase()) : false )) {
          this.contacts.push(contact);
        }
      })
    }
  }

  /**
   * Method to toggle html-elements
   * @param input : html-element
   */
  triggerInput(input): void{
    input.value = null;
    input.click();
  }

  /**
   * Uploading attachments
   * @param e: event with form-data formatted file
   */
  uploadFile(e: Event): void {
    const files = [].slice.call(e.target['files']);
    this.attachmentUploading = true;

    for (const file of files) {
      // Maximum allowed file size 25Mb (26214400 Bytes)
      if (file.size < 26214400) {
        this.mailService.uploadFile(file)
          .then(
            (data: {
              file_id: string,
              success: boolean,
              size: number,
              name: string,
              type: string,
            }) => {
              this.attachments.push({
                id: data.file_id,
                name: data.name,
                type: data.type,
                size: data.size / 1000,
              });
              this.formFileIdsArray();
              this.allowSave();
              this.attachmentUploading = false;
            },
            error => {
              if (error.status === 413) {
                this.errorMessage = `Sorry, ${file.name} larger than 25MB is not allowed`;
              } else {
                this.errorMessage = error.json().erorr;
              }
              this.attachmentUploading = false;
            }
          );
      } else {
        this.errorMessage = `Sorry, ${file.name} larger than 25MB is not allowed`;
        this.attachmentUploading = false;
      }
    }
  }

  /**
   * Unattach file from message
   * @param file
   */
  removeAttachedFile(file): void{
    this.attachments.splice(this.attachments.indexOf(file), 1);
    this.formFileIdsArray();
    if (this.attachments.length > 0) {
      this.allowSave();
    }
  }

  attachmentIcon(type: string): string {
    const splitType = type.split('/');
    const attachmentIcons = {
      image: 'file-image-o',
      audio: 'file-audio-o',
      video: 'file-video-o',
      text: 'file-text-o',
      default: 'file-archive-o'
    };

    return 'fa fa-' + (attachmentIcons[splitType[0]] || attachmentIcons.default);
  }

  /**
   * Get ids of attachments
   */
  formFileIdsArray(): void{
    this.attachments.forEach(file => {
      this.file_ids.push(file.id);
    })
  }

  /**
   * Fill fields depending on type of action 'reply'/'replyAll'/'forward'
   * @param response : { action: string, data: MailMessage }
   */
  replyMail(action: string, message: MailMessage) {
    switch (action) {
      case 'reply':
        this.to.push(message.from);
        this.modalTitle = `Reply to:  ${message.from.name ? message.from.name : message.from.email}`;
        this.subject = 'Re: ' + message.subject;
        this.threadId = message.thread;
        this.replyToMessageId = message.id;
        this.replied = true;
        this.messageTxt = this._messageTemplates.reply
          .replace('{{signature}}', this.selectedSignature ? this.selectedSignature.content : '')
          .replace('{{name}}', message.from.name)
          .replace('{{email}}', message.from.email)
          .replace('{{sentTime}}', this.mailDatePipe.transform(message.sentTime, false))
          .replace('{{body}}', message.body);
        break;
      case 'replyAll':
        this.modalTitle = 'Reply to all';
        this.to = message.to.filter(data => data.email !== this.from.email);
        this.cc = message.cc.filter(data => data.email !== this.from.email);
        this.bcc = message.bcc.filter(data => data.email !== this.from.email);
        const emailFrom = message.from.email;
        if (emailFrom !== this.from.email) {
          this.to.push(message.from);
        }

        this.showCc = !!this.cc.length;
        this.showBcc = !!this.bcc.length;

        this.subject = 'Re: ' + message.subject;
        this.replied = true;
        this.threadId = message.thread;
        this.replyToMessageId = message.id;

        this.messageTxt = this._messageTemplates.reply
          .replace('{{signature}}', this.selectedSignature ? this.selectedSignature.content : '')
          .replace('{{name}}', message.from.name)
          .replace('{{email}}', message.from.email)
          .replace('{{sentTime}}', this.mailDatePipe.transform(message.sentTime, false))
          .replace('{{body}}', message.body);
        break;
      case 'forward':
        this.modalTitle = `Forward message from: ${message.from.name ? message.from.name : message.from.email}`;
        this.subject = 'Forwarded message: ' + message.subject;
        this.threadId = message.thread;
        this.forwarded = true;
        this.messageTxt = this.messageTxt = this._messageTemplates.forward
          .replace('{{signature}}', this.selectedSignature ? this.selectedSignature.content : '')
          .replace('{{name}}', message.from.name)
          .replace('{{email}}', message.from.email)
          .replace('{{sentTime}}', this.mailDatePipe.transform(message.sentTime, false))
          .replace('{{body}}', message.body);
        break;
      default:
        this.messageTxt = this._messageTemplates.new
          .replace('{{signature}}', this.selectedSignature ? this.selectedSignature.content : '');
        break;
    }

    this.initialReplyTemplate = this.messageTxt;

    this.allowSaving = true;
  }

  /**
   * Handle key-up event of <text-editor> component
   * @param e: html-content
   */
  editorChangesHandler(e: string): void {
    this.messageTxt = e;
    if (e.length > 0) {
      this.allowSaving = true;
      return;
    }

    this.allowSaving = false;
  }

  /**
   * Get custom signature
   */
  getSignatures() {
    this.accountService.getSignatures()
      .subscribe(signatures => {
        this.signatures = signatures
        if (!this.selectedSignature) {
          this.selectedSignature = this.signatures.find(sign => sign.isDefault === true);
        }
      });
  }

  /**
   * Use chosen signature
   */
  useSignature(signature) {
    this.selectedSignature = signature;
    this.messageTxt = signature.content + ' ' + this.initialReplyTemplate;
  }

  /**
   * Get quick reply templates
   */
  getQuickReplyTemplates() {
    this.accountService.getQuickReplyTemplates()
      .subscribe(replyTemplates => this.quickReplyTemplates = replyTemplates);
  }

}
