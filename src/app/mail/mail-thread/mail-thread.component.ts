import {Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';

import { MailMessage } from '../mail-message';
import { MailTopic } from '../mail-topic';
import { MailService } from '../mail.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';

@Component({
  selector: 'app-mail-thread',
  templateUrl: './mail-thread.component.html',
  styleUrls: ['./mail-thread.component.css']
})
export class MailThreadComponent implements OnChanges {

  private _thread: string;
  private loading: boolean = false;
  private messages: MailMessage[];
  showAll = false;
  isOpenThread: boolean;
  @Input() ignoreMessage: string;

  @Output() isHasThreads = new EventEmitter<boolean>();
  @Output() topicSelected = new EventEmitter<MailTopic>();
  @Input()
  set thread(thread: string) {
    this._thread = thread;
    if (this._thread) {
      this.loading = true;
      this.messages = [];
      this.mailService.getMessagesInThread(this._thread)
        .then(messages => {
          this.loading = false;
          this.messages = messages;
          this.isHasThreads.emit(this.messages.length > 1);
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    }
  }
  get thread(): string {
    return this._thread;
  }

  constructor(
    private mailService: MailService,
    private ga: GoogleAnalyticsService
  ) { }

  ngOnChanges() {
    this.showAll = false;
  }

  getMessages(): MailMessage[] {
    return this.messages.filter((message) => message.id !== this.ignoreMessage);
  }

  selectTopic(topic) {
    this.topicSelected.emit(topic);
  }

  expandThread() {
    this.ga.trackEvent('mail-content', 'expand-thread');
  }

  showAllMessagesInThread() {
    this.showAll = true;
  }

  // TODO: Should be overwritten later with some native Angular methods
  // (maybe with subscribe on DOM change)
  scrollToTop(el: MouseEvent): void {
    if (this.isOpenThread) {
      document.getElementById('mail-content').scrollTo(
        0,
        (el.currentTarget as HTMLElement).offsetTop - document.querySelector('.main-header').getBoundingClientRect().height,
      );
    }
  }
}
