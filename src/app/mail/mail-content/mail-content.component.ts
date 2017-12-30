import { Component, OnInit, Input, Output, OnDestroy, OnChanges, EventEmitter, ViewChild } from '@angular/core';
import { MailMessage, Recipient } from '../mail-message';
import { MailTopic } from '../mail-topic';
import { MailService } from '../mail.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';
import { ModalService } from '../modals/modal.service';
import { Router } from '@angular/router';
import { Editor } from 'tinymce';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-mail-content',
  templateUrl: './mail-content.component.html',
  styleUrls: ['./mail-content.component.css']
})
export class MailContentComponent implements OnInit, OnDestroy, OnChanges {

  attachmentIcons = {
    image: 'file-image-o',
    audio: 'file-audio-o',
    video: 'file-video-o',
    text: 'file-text-o',
    default: 'file-archive-o'
  };

  private _selectedMessage: MailMessage;

  discoveredTopicsToggleState: boolean = true;

  topicsConfig = {
    displayTopicsAmount: 10,
    minTopicsLimit: 10,
  };

  @Input() selectedContact: Recipient;
  @Output() selectedContactChange = new EventEmitter<Recipient>();
  topics: MailTopic[];
  selectedTopic: MailTopic;
  @Output() topicSelected = new EventEmitter<MailTopic>();
  highlightedBody: string;
  sending: boolean = false;
  editor: Editor;
  showEditorPlaceholder: boolean = true;
  @Output() onReply = new EventEmitter<BsModalRef>();
  @ViewChild('popAttachment') popAttachment: PopoverDirective;

  @Input()
  set selectedMessage(message: MailMessage) {
    this.topics = [];
    this.selectedTopic = null;
    this._selectedMessage = message;

    if (message) {
      this.highlightedBody = message.body;
      this.getTopics(message);
      this.checkForInputMessage(message)
        .then(() => {
          this.initTextInEditor()
        })
    }
  }

  get selectedMessage(): MailMessage {
    return this._selectedMessage;
  }

  constructor(
    private mailService: MailService,
    private ga: GoogleAnalyticsService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.editor) {
      this.showEditorPlaceholder = true;
      this.editor.setContent('Type your reply here...')
    }
  }

  attachmentIcon(type: string): string {
    const splitType = type.split('/');

    return 'fa fa-' + (this.attachmentIcons[splitType[0]] || this.attachmentIcons.default);
  }

  snoozeMessage(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'snooze');
    this.mailService.snoozeMessage(message.id);
  }

  reply(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'reply');
    const modal = this.modalService.compose('reply', message);
    this.onReply.emit(modal);
  }

  replyAll(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'reply-all');
    const modal = this.modalService.compose('replyAll', message);
    this.onReply.emit(modal);
  }

  forwardMessage(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'forward');
    const modal = this.modalService.compose('forward', message);
    this.onReply.emit(modal);
  }

  starMessage(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'star');
    this.mailService.starMessage(message)
  }

  markMessageAsRead(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'mark-as-read');
    this.mailService.readUnreadMessage(message)
  }

  moveMessageToSpam(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'move-to-spam');
    this.mailService.moveMessageToAnotherFolder(message, 'spam')
      .then(data => {
        if(data){
          this.mailService.selectNextAvailableMessage(data);
        }
      });
  }

  moveMessageToTrash(message: MailMessage) {
    this.ga.trackEvent('mail-content', 'delete');
    this.mailService.moveMessageToAnotherFolder(message, 'trash')
      .then(data => {
        if(data){
          this.mailService.selectNextAvailableMessage(data);
        }
      });
  }

  printMail() {
    let printContents = document.getElementById("printArea").innerHTML;
    let printMailTemplate: string = '<html><head><style> @media print { .no-print { display: none } } </style> </head><body>{{content}}</body></html>';
    printMailTemplate = printMailTemplate.replace('{{content}}', printContents);

    let printWin = window.open();
    printWin.document.write(printMailTemplate);
    printWin.focus();
    printWin.print();
  }

  setDefaultDisplayTopics() {
    this.discoveredTopicsToggleState = false;
    this.topicsConfig.displayTopicsAmount = this.topicsConfig.minTopicsLimit;
  }

  getTopics(message: MailMessage) {
    if (message.topics && message.topics.length > 0) {
      this.topics = message.topics
      this.setDefaultDisplayTopics();
    } else {
      this.mailService.getTopics(message)
        .then(data => {
          if(data && data.length) {
            this.topics = data
            this.setDefaultDisplayTopics();
          }
        });
    }
  }

  toggleTopics() {
    this.discoveredTopicsToggleState = !this.discoveredTopicsToggleState;

    if (this.discoveredTopicsToggleState) {
      this.topicsConfig.displayTopicsAmount = undefined;
    } else {
      this.setDefaultDisplayTopics();
    }
  }

  selectContact(contact: Recipient) {
    if (this.selectedContact === contact) {
      this.selectedContact = null;
    } else {
      this.selectedContact = contact;
    }
    this.selectedContactChange.emit(this.selectedContact);
  }

  selectTopic(topic: MailTopic) {
    this.ga.trackEvent('mail-content', 'highlight-topic');
    if (this.selectedTopic === topic) {
      this.selectedTopic = null;
      this.topicSelected.emit(this.selectedTopic);
      this.highlightedBody = this._selectedMessage.body;
      return;
    }

    this.selectedTopic = topic;
    this.topicSelected.emit(this.selectedTopic);
    let highlightedBody = this._selectedMessage.body;

    if (topic.offsets) {
      topic.offsets.forEach((highligh, index) => {
        if (highlightedBody.length > highligh['start'] &&
            highlightedBody.length > highligh['end']) {
          highlightedBody =
            highlightedBody.slice(0, highligh['start'] + index * 13) +
            '<mark>' +
            highlightedBody.slice(highligh['start'] + index * 13, highligh['end'] + index * 13) +
            '</mark>' +
            highlightedBody.slice(highligh['end'] + index * 13);
        }
      });
    }
    this.highlightedBody = highlightedBody;

    this.scrollToSelectedTopic();
  }

  scrollToSelectedTopic() {
    setTimeout(function () {
      const navbarBounds = document.getElementsByClassName('navbar')[0].getBoundingClientRect();
      const divElement = document.getElementById('mail-content');
      const mailTopicsElement = document.getElementsByClassName('mail-topics')[0].getBoundingClientRect();
      const markElement = document.getElementsByTagName('mark');
      if (markElement && markElement[0]) {
          const box = markElement[0].getBoundingClientRect();
          const top = box.top + window.pageYOffset - markElement[0].clientTop;
          divElement.scrollTop = top - navbarBounds.height - mailTopicsElement.height - 20; // elementTop - navbar height - 20 for padding
      }
     }, 1000);
  }

  annotateTopics() {
    this.modalService.topicsAnnotations(this.selectedMessage);
  }

  showRelatedEmails(query: string): void {
    this.ga.trackEvent('mail-content', 'topic-related-mail');
    this.router.navigate(['/mail/search/topic/' + query]);
  }

  showRelatedTopics(query: string): void {
    this.router.navigate(['/insights/search'], { queryParams: { q: query} });
  }

  showRelatedAttachments(query: string): void {
    console.log('This feature is under development, will be available in new releases. Tried to look for attachments of:\n', query);
  }

  openAttachmentModal(file, e) {
    e.stopPropagation();
    this.popAttachment.hide();
    this.modalService.attachment(file);
  }

  saveAs(fileURL) {
    window.open(fileURL,"_blank");
  }

  instantReply() {
    this.ga.trackEvent('mail-action', 'instant-reply');
    this.sending = true;

    let instantReplyText = ''
    if (this.editor) {
       instantReplyText = this.editor.getContent()
    }

    const mail = {
      body: instantReplyText,
      from: this.selectedMessage.to,
      to: [this.selectedMessage.from],
      cc: this.selectedMessage.cc,
      bcc: this.selectedMessage.bcc,
      subject: 'Re: ' + this.selectedMessage.subject
    }

    this.mailService.sendMessage(mail)
      .then(res => {
        this.sending = false;
      })
      .catch(err => {
        console.error(err);
      })
  }


  initTextInEditor() {
    tinymce.init({
      selector: '.instant-reply',
      inline: true,
      plugins: ['link', 'paste', 'autoresize'],
      skin_url: '../assets/skins/lightgray',
      menubar: false,
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      init_instance_callback: editor => {
        this.editor = editor;
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  focusOnInstantReply() {
    if (this.editor && this.editor.getContent() === '<p>Type your reply here...</p>') {
      this.showEditorPlaceholder = false;
      this.editor.setContent('');
    }
  }

  focusOutInstantReply() {
    if (this.editor && this.editor.getContent() === '') {
      this.showEditorPlaceholder = true;
      this.editor.setContent('<p>Type your reply here...</p>');
    }
  }

  checkForInputMessage(message: MailMessage): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (message) {
        resolve(true);
      } else {
        reject();
      }
    })
  }
}
