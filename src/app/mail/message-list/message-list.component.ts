import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MailMessage, Recipient } from '../mail-message';
import { MailListComponent } from '../mail-list/mail-list.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent extends MailListComponent implements OnInit {

  @Input() messages: MailMessage[];
  @Input() selectedMessage: MailMessage;
  @Input() selectedMessageIndex: number;
  @Input() page: number;
  @Input() total: number;
  @Input() mailBulk: MailMessage[];
  @Input() folder: string;
  @Input() search: boolean;
  @Input() currentFolder: string;
  @Input() selectedOrder: string;
  @Input() lastMessageInBulk: MailMessage;
  @Input() lastMessageInBulkIndex: number;
  @Output() selectMessageChange:  EventEmitter<{messages: MailMessage, index: number, event: object}> = new EventEmitter<{messages: MailMessage, index: number, event: object}>();
  @Output() moveMessageToSpanEvent:  EventEmitter<MailMessage> = new EventEmitter<MailMessage>();
  @Output() moveMessageToTrashEvent:  EventEmitter<MailMessage> = new EventEmitter<MailMessage>();
  @Output() moveMessageToInboxEvent:  EventEmitter<MailMessage> = new EventEmitter<any>();
  @Output() deleteMessageEvent:  EventEmitter<MailMessage> = new EventEmitter<MailMessage>();
  @Output() selectNextMessageEvent:  EventEmitter<{event: object, list: string}> = new EventEmitter<{event: object, list: string}>();
  @Output() selectPreviousMessageEvent:  EventEmitter<{event: object, list: string}> = new EventEmitter<{event: object, list: string}>();
  @Output() messageBulkChange:  EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() messageBulkActionEvent:  EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pinMessageEvent:  EventEmitter<{event: object, message: MailMessage}> = new EventEmitter<{event: object, message: MailMessage}>();
  private emailWithAction: MailMessage; // storage for sharing handling email with view (using in Move to Spam/Trash)
  isPinnedMessage = this._isPinnedMessage.bind(this);

  ngOnInit() { }

  resetMailBulk(){
    this.messageBulkChange.emit(true)
  }

  selectMsg(message: MailMessage, index: number, event: object) {
    this.selectMessageChange.emit({messages: message, index:index, event:event})
  }

  moveMessageToSpam(message: MailMessage) {
    this.emailWithAction = message;
    this.moveMessageToSpanEvent.emit(message)
  }

  moveMessageToTrash(message: MailMessage) {
    this.emailWithAction = message;
    this.moveMessageToTrashEvent.emit(message)
  }
  moveMessageToInbox(message: MailMessage){
    this.moveMessageToInboxEvent.emit(message)
  }
  // TODO: This overloaded methods from MailLis invokes only on Remove forever button from Trash folder
  // Should be renamed or removed
  deleteMessage(message: MailMessage){
    this.deleteMessageEvent.emit(message)
  }

  deleteAllInBulk(){
    this.messageBulkActionEvent.emit(true)
  }

  userNames(recipients: Array<Recipient>): string {
    return recipients.map(({name, email}) => name || email).join(', ');
  }

  pinMessage(event: object, message: MailMessage){
    this.pinMessageEvent.emit({event, message})
  }

  _isPinnedMessage(message) {
    return !message.pinned
  }

  @HostListener('document:keydown', ['$event'])
  keydown(event) {
    let index;
    if(this.search && this.messages) {
      index = this.messages.indexOf(this.selectedMessage);
    }
    if (event.keyCode == 40 || ((event.keyCode == 40) && (event.ctrlKey === true || event.shiftKey === true))) {
      this.list = index === -1 ? 'keywordList' : 'topicList';
      this.selectNextMessageEvent.emit({event: event, list: this.list})
    }
    else if (event.keyCode == 38 || ((event.keyCode == 38) && (event.ctrlKey === true || event.shiftKey === true))) {
      this.selectPreviousMessageEvent.emit({event: event, list: this.list})
    }
    // Event listener for Esc button
    if (event.keyCode === 27 || event.which === 27) {
      this.messageBulkChange.emit(true)
    }
  }

}
