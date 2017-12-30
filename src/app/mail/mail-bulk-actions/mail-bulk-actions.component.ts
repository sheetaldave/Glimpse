import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MailMessage } from '../mail-message';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-bulk-actions',
  templateUrl: './mail-bulk-actions.component.html',
  styleUrls: ['./mail-bulk-actions.component.css']
})
export class MailBulkActionsComponent implements OnInit {
  private _messages: MailMessage[];
  @Input()
  set messages(messages:MailMessage[]) {
    this._messages = messages as MailMessage[];
  }

  get messages() {
    return this._messages
  }

  @Output() onMessagesChanges = new EventEmitter<MailMessage[]>();

  constructor(private mailService: MailService) { }

  ngOnInit() {}

  clearBulk() {
    this.messages.forEach((message) => {
      message['inBulk'] = false;
    });
    this.onMessagesChanges.emit([] as MailMessage[]);
    this._messages = [];
  }

  _isInBulk(message: MailMessage): boolean {
    if (this.messages.indexOf(message) !== -1) {
      return true;
    }
    return false;
  }

  removeFromBulk(message: MailMessage): void {
    message['inBulk'] = false;
    this.messages.splice(this.messages.indexOf(message), 1);
  }

  moveMessages(messages: MailMessage[], folderId: string) {
    this.mailService.moveMessages(messages, folderId)
      .then((data) => {
        this.mailService.selectNextAvailableMessage(data);
        //TODO: notify user about success/failure
        this.clearBulk();
      })
  }
}
