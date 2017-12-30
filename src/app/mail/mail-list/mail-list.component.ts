import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { MailMessage, Recipient } from '../mail-message';
import { MailService } from '../mail.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';
import { MailTopic } from '../mail-topic';
import { ContextMenuComponent } from 'ngx-contextmenu/lib/contextMenu.component';
import { SearchService } from '../../search/search.service';
import { TopicsService } from '../../topics/topics.service';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from '../modals/modal.service';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @Input() query;
  queryType: string;
  messages: MailMessage[];
  selectedMessage: MailMessage;
  selectedMessageIndex: number;
  loading: boolean = false;
  currentFolder: string;
  folder: string;
  isImportant : boolean = false;
  lastMessageInBulk: MailMessage = null;
  lastMessageInBulkIndex: number;
  selectedIndex: number;
  selectedTopic: MailTopic;
  selectedContact: Recipient;
  orders: string[] = ['Date', 'Subject', 'Thread', 'Sender', 'Attachments'];
  selectedOrder: string;
  public isUnread: boolean;
  public showReplyAll = this._showReplyAll.bind(this);
  messageSubscription: Subscription;
  selectMessageSubscription: Subscription;
  mailBulk: MailMessage[] = [];
  isInBulk = this._isInBulk.bind(this);
  isHasThreads: boolean = false;
  isKeyword: boolean = false;
  list: string;
  mailListPaginationConfig = {
    total: 0,
    page: 1,
    limit: 20
  };
  allMessages = [];
  search: boolean = false;
  searchResult: MailMessage[];
  searchPaginationConfig = {
    pageNo: 1,
    count: 0
  };
  pinMessagePaginationConfig = {
    pageNo: 1,
    count: 0,
    limit: 2
  };
  splitAreaSize = {
    mailList: 25,
    pinnedMessage: 25,
    knowledgePanel: 30,
    mailListSearchVertical: 50
  };
  hasPinnedMessages: boolean = false;
  pinnedMessages: MailMessage[];
  allPinnedMessages: MailMessage[];
  constructor(protected mailService: MailService,
              private route: ActivatedRoute,
              protected router: Router,
              protected location: Location,
              protected topicService: TopicsService,
              protected ga: GoogleAnalyticsService,
              protected searchService: SearchService,
              public modalService: ModalService) {
  }

  ngOnInit() {
    this.selectedOrder = 'Date';
    this.subscribeToRouting();
    this.setDefaultSplitAreaSize();

    this.selectMessageSubscription = this.mailService.selectNextMessage$.subscribe( data => {
      if (data) {
        this.messages = data;
        this.selectNextAvailableMessage(data);
      }
    });
  }

  getSelectedMessage(event){
   this.selectMessage(event.messages, event.index, event.event)
  }

  onNext(): void {
    this.isKeyword = false;
    this.mailListPaginationConfig.page++;
    this.loadMoreMessages();
  }

  onPrevious(): void {
    this.isKeyword = false;
    this.mailListPaginationConfig.page--;
    this.loadMoreMessages();
  }

  hasThreads (ev: boolean) {
    this.isHasThreads = ev;
  }

  onSearchNext() {
    this.isKeyword = true;
    this.searchPaginationConfig.pageNo++;
    this.loadMoreMessages();
  }

  onSearchPrev() {
    this.isKeyword = true;
    this.searchPaginationConfig.pageNo--;
    this.loadMoreMessages();
  }


  onPinnedMessageNext(): void {
    this.pinMessagePaginationConfig.pageNo++;
    this.loadMorePinnedMessages();
  }

  onPinnedMessagePrevious(): void {
    this.pinMessagePaginationConfig.pageNo--;
    this.loadMorePinnedMessages();
  }

  loadMorePinnedMessages() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.pinnedMessages = [];
    if (this.allPinnedMessages.length >= (this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo)) {
      this.pinnedMessages = this.allPinnedMessages.slice((this.pinMessagePaginationConfig.limit * (this.pinMessagePaginationConfig.pageNo - 1)), this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo);
      this.loading = false;
    } else {
      this.mailService.getMorePinnedMessages(this.folder, this.selectedOrder)
        .then((result: {pinnedMessages :MailMessage[], count: number}) => {
          this.allPinnedMessages = result['pinnedMessages'];
          this.pinnedMessages = this.allPinnedMessages.slice((this.pinMessagePaginationConfig.limit * (this.pinMessagePaginationConfig.pageNo - 1)), this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo);
          this.loading = false;
        });
    }
  }

  ngOnDestroy() {
    if (this.messageSubscription && !this.messageSubscription.closed) {
      this.messageSubscription.unsubscribe();
    }
  }

  loadMoreMessages(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    let offset = this.isKeyword ? (this.searchPaginationConfig.pageNo-1) * this.mailListPaginationConfig.limit : (this.mailListPaginationConfig.page-1) * this.mailListPaginationConfig.limit;
    if (this.folder === 'search') {
      if (this.isKeyword) {
        this.searchService.searchMessages(this.query, 'keyword', this.mailListPaginationConfig.limit, offset)
          .then(result => {
            this.loading = false;
            this.searchResult = result['messages'];
            this.selectMessage(this.searchResult[0], 0);
          });
      }
      else {
        this.searchService.searchMessages(this.query, this.queryType, this.mailListPaginationConfig.limit, offset)
          .then(result => {
            this.loading = false;
            this.messages = result['messages'];
            this.selectMessage(this.messages[0], 0);
          });
      }

    } else {
      this.messages = [];
      if (this.allMessages.length >= (this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page)) {
        this.messages = this.allMessages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
        if(this.messages.length > 0){
          this.selectMessage(this.messages[0], 0);
        }
        this.loading = false;
      } else {
        this.mailService.getMoreMessages(this.folder, this.selectedOrder)
          .then(result => {
            this.allMessages = result['messages'];
            this.messages = this.allMessages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
            if(this.messages.length > 0){
              this.selectMessage(this.messages[0], 0);
            }
            this.loading = false;
          });
      }
    }
  }

  selectMessage(message: MailMessage,index :number, e?): void {

    if ((e && e.ctrlKey && !e.keyCode) || (e && e.shiftKey && (e.keyCode === 38 || e.keyCode === 40))) {
      if (this._isInBulk(message)) {
        return this.removeFromBulk(message, index)
      }
      return this.selectForBulk(message, index);
    }

    if (e && e.shiftKey && this.mailBulk.length > 0) {
      let initial = this.messages.indexOf(this.mailBulk[this.mailBulk.length - 1]);
      if(initial > index) {
        this.selectMultipleMessagesForBulk(index, initial);
      } else if (initial < index) {
        this.selectMultipleMessagesForBulk(initial, index);
      }
      return;
    }

    if (this.mailBulk.length > 0) {
      this.clearBulk();
    }

    // TODO: Should be flattened after updating tslint rules
    // We need check on existing message object because if doesn't exist when email restored from trash.
    if (this.selectedMessage && message) {
      if (this.selectedMessage.id !== message.id) {
        this.removeFromBulk(this.selectedMessage, index);
      }
    }

    const divElement = document.getElementById("mail-content");
    if(divElement){
      divElement.scrollTop = 0;
    }
    this.selectedMessage = message;
    this.selectedMessageIndex = index;
    this.selectForBulk(this.selectedMessage);
    this.selectedContact = null;
    this.selectedTopic = null;
    // Check whether the selectedMessageDiv visible on screen
    this.scrollToSelectedMessage(message);


    if (message.unread) {
      this.mailService.readUnreadMessage(message)
    }

    this.ga.trackEvent('mail-list', 'select-message');
  }

  onRightClick(message: MailMessage) {
    this.isUnread = message.unread;
    let labels = [];
    message.labels.forEach(x => {
      labels.push(x.name);
    });
    let index = labels.indexOf('important');
    if (index > -1) {
      this.isImportant = true
    }
    else {
      this.isImportant = false
    }
  }

  snoozeMessage(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'snooze');
    this.mailService.snoozeMessage(message.id);
  }

  reply(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'reply');
    this.modalService.compose('reply', message);
  }

  replyAll(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'reply-all');
    this.modalService.compose('replyAll', message);
  }

  forwardMessage(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'forward');
    this.modalService.compose('forward', message);
  }

  starMessage(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'star');
    this.mailService.starMessage(message)
  }

  markAsImportant(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'mark-important');
    this.mailService.addLabel(message, 'important')
      .then((data)=> console.log(data))
  }


  markMessageAsReadUnread(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'mark-as-read');
    this.mailService.readUnreadMessage(message)
  }

  moveMessageToSpam(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'move-to-spam');
    this.mailService.moveMessageToAnotherFolder(message, 'spam')
      .then(data => {
        if (data) {
         this.selectNextAvailableMessage(data);
        }
      });
  }

  selectNextAvailableMessage(messages?: Array<MailMessage>) {
    this.messages = messages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
    this.selectMessage(this.messages[this.selectedMessageIndex], this.selectedMessageIndex);
  }

  deleteMessage(message: MailMessage) {
    this.mailService.deleteMessage(message)
      .then(data => {
        if (data) {
          this.selectNextAvailableMessage(data);
        }
      });
  }

  pinnedMessage(event: object) {
    const e = event['event'];
    const message = event['message'];
    e.stopPropagation();
    this.mailService.pinnedMessage(message)
      .then((data:{messages: MailMessage[], count: number, pinnedMessages: MailMessage[], pin_count: number}) => {
        if (data) {
          if(data['pinnedMessages'].length) {
            this.allPinnedMessages = data['pinnedMessages'];
            if (!message.pinned && this.pinMessagePaginationConfig.pageNo * this.pinMessagePaginationConfig.limit > this.pinMessagePaginationConfig.count) {
              this.pinMessagePaginationConfig.pageNo = this.pinMessagePaginationConfig.pageNo - 1;
            }
            const pinMessageIndex = this.pinnedMessages.indexOf(message);
            if (pinMessageIndex === this.selectedMessageIndex) {
              this.pinnedMessages = this.allPinnedMessages.slice((this.pinMessagePaginationConfig.limit * (this.pinMessagePaginationConfig.pageNo - 1)), this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo);
              this.selectMessage(this.pinnedMessages[this.selectedMessageIndex], this.selectedMessageIndex);
            }
            else {
              this.pinnedMessages = this.allPinnedMessages.slice((this.pinMessagePaginationConfig.limit * (this.pinMessagePaginationConfig.pageNo - 1)), this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo);
            }
          }
          this.pinMessagePaginationConfig.count = data['pin_count'];
          const index = this.messages.indexOf(message);
          if (index === this.selectedMessageIndex) {
            this.messages = data['messages'].slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
            if(this.messages.length === 0){
              this.getLastPageData(message, data['messages'])
            }
            this.selectMessage(this.messages[this.selectedMessageIndex], this.selectedMessageIndex);
          } else {
            this.messages = data['messages'].slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
            if(this.messages.length === 0){
              this.getLastPageData(message, data['messages'])
            }
          }
          this.mailListPaginationConfig.total = data['count'];
        }
        this.hasPinnedMessages = this.pinMessagePaginationConfig.count && this.pinMessagePaginationConfig.count !== 0;
      });
  }

  getLastPageData(message: MailMessage, messages: MailMessage[]){
    if(message.pinned && this.messages.length === 0 && this.mailListPaginationConfig.total > 0){
      this.mailListPaginationConfig.page = this.mailListPaginationConfig.page - 1;
      this.messages = messages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
    }
  }

  moveMessageToTrash(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'delete');
    this.mailService.moveMessageToAnotherFolder(message, 'trash')
      .then((data: Array<MailMessage>) => {
        if (data) {
          this.selectNextAvailableMessage(data);
        }
      });
  }

  moveMessageToInbox(message: MailMessage) {
    this.ga.trackEvent('mail-list', 'move-to-inbox');
    this.mailService.moveMessageToAnotherFolder(message, 'inbox')
      .then(data => {
        if (data) {
          this.selectNextAvailableMessage(data);
        }
      });
  }

  selectNextMessage(e) {
    let index;
    const event = e.event;
    this.list = e.list;
    if(e.list === 'keywordList') {
     if(this.lastMessageInBulkIndex === -1) {
       this.lastMessageInBulkIndex = 0;
     }
    }
    if (event.shiftKey) {
      if (this.lastMessageInBulk === null) {
        index = this.selectedMessageIndex;
      } else if (this.lastMessageInBulkIndex < this.selectedMessageIndex) {
        index = this.lastMessageInBulkIndex;
      } else {
        index = this.lastMessageInBulkIndex + 1;
      }
    } else {
      this.lastMessageInBulkIndex = 0;
      this.lastMessageInBulk = null;
      index = this.selectedMessageIndex + 1;
    }
    if (!isNaN(index) && !(index >= this.messages.length)) {
      if (this.search){
        if (e.list === 'topicList') {
          this.selectMessage(this.messages[index], index, event);
        } else {
          this.selectMessage(this.searchResult[index], index, event);
        }
      } else {
        this.selectMessage(this.messages[index], index, event);
      }
    }
  }

  selectPreviousMessage(e) {
    let index;
    const event = e.event;
    if (event.shiftKey) {
      if (this.lastMessageInBulk === null) {
        index = this.selectedMessageIndex;
      } else if (this.lastMessageInBulkIndex <= this.selectedMessageIndex) {
        index = this.lastMessageInBulkIndex - 1;
      } else {
        index = this.lastMessageInBulkIndex;
      }
    } else {
      this.lastMessageInBulkIndex = 0;
      this.lastMessageInBulk = null;
      if (this.messages.length === 0) {
        this.selectedMessage = null;
      } else {
        index = this.selectedMessageIndex - 1;
      }
    }
    if (index >= 0) {
      if (e.list === 'topicList') {
        this.selectMessage(this.messages[index], index, event);
      } else {
        this.selectMessage(this.searchResult[index], index, event);
      }
    }
  }

  _showReplyAll (message) {
    return message.participants.length > 2;
  }

  subscribeToRouting() {
    const messageIdObservable = this.route.queryParamMap
      .map(params => {
        return params.get('messageId') || null;
      });

    messageIdObservable.subscribe(messageId => {
      if (messageId) {
        this.mailService.getMessage(messageId)
          .then(message => {
            if (message) {
              this.openMessageModal(message);

              // remove query parameters from browser URL
              const path = this.route.snapshot.url
                .map(value => value.path)
                .join('/');
              this.location.replaceState(path);

            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });

    this.route.params
      .subscribe((params: Params) => {
        this.mailListPaginationConfig.page = 1;
        this.mailListPaginationConfig.total = 0;
        this.pinMessagePaginationConfig.pageNo = 1;
        this.pinMessagePaginationConfig.count = 0;
        this.folder = params['folder'];
        this.currentFolder = this.folder;
        this.queryType = params['type'];
        this.query = params['query'];
        this.messages = [];
        this.selectedMessage = null;
        this.loading = true;
        this.manageSubscriptionToNewMessages();
        let messagesPromise;
        let searchPromise;
        let pinnedPromise;
        if (this.folder === 'search' && this.query.length > 2) {
          if (this.queryType === 'topic') {
            this.search = true;
            searchPromise = this.searchService.searchMessages(this.query, 'keyword');
          } else {
            this.search = false;
          }
          messagesPromise = this.searchService.searchMessages(this.query, this.queryType);
        } else {
          messagesPromise = this.mailService.getMessages(this.folder, this.selectedOrder);
          pinnedPromise = this.mailService.getPinnedMessages(this.folder, this.selectedOrder);
        }
        messagesPromise.then((result: {messages: MailMessage[], count: number}) => {
          this.allMessages = result['messages'];
          this.messages = this.allMessages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
          this.mailListPaginationConfig.total = result['count'];
          this.loading = false;
          if (this.messages && this.messages.length > 0) {
            this.selectMessage(this.messages[0], 0);
          } else {
            this.selectedMessage = null;
          }
        });
        if(pinnedPromise) {
          this.hasPinnedMessages = false;
          pinnedPromise
            .then((data:{pinnedMessages :MailMessage[], count: number})=> {
              this.allPinnedMessages = data['pinnedMessages'];
              this.pinnedMessages = this.allPinnedMessages.slice((this.pinMessagePaginationConfig.limit * (this.pinMessagePaginationConfig.pageNo - 1)), this.pinMessagePaginationConfig.limit * this.pinMessagePaginationConfig.pageNo);
              this.pinMessagePaginationConfig.count = data['count'];
              this.hasPinnedMessages = this.pinMessagePaginationConfig.count && this.pinMessagePaginationConfig.count !== 0;
            })
        }
        if (searchPromise) {
          this.searchResult = [];
          searchPromise.then((searchResult: {SearchMessages :MailMessage[], count: number}) => {
            this.searchResult = searchResult['messages'];
            this.searchPaginationConfig.count = searchResult['count'];
          })
        }
      });
  }

  manageSubscriptionToNewMessages(): void {
    // Auto update of new messages works only for non seach queries with date ordering
    if (this.folder && this.folder !== 'search'
        && this.selectedOrder === 'Date') {
      if (!this.messageSubscription || this.messageSubscription.closed) {
        this.messageSubscription = this.mailService.getRecentMessages()
          .subscribe(messages => {
            this.allMessages = messages['messages'];
            this.mailListPaginationConfig.total = messages['count'];
            this.messages = this.allMessages.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
          });
       }
    } else if (this.messageSubscription && !this.messageSubscription.closed) {
      this.messageSubscription.unsubscribe();
    }
  }

  selectOrder(order: string): void {
    this.mailListPaginationConfig.page = 1;
    this.mailListPaginationConfig.total = 0;
    this.selectedOrder = order;
    this.manageSubscriptionToNewMessages();
    this.mailService.getMessages(this.folder, this.selectedOrder)
      .then(data => {
        this.messages = data['messages'];
        this.mailListPaginationConfig.total = data['count'];
        if (this.messages.length > 0) {
            this.selectMessage(this.messages[0], 0);
        } else {
          this.selectedMessage = null;
        }
      });
  }

  selectForBulk(message: MailMessage, index?) {
    if (this._isInBulk(message)) {
      return;
    }
    message['inBulk'] = true;
    if (!index) {
      this.lastMessageInBulkIndex = this.messages.indexOf(message)
    } else {
      this.lastMessageInBulkIndex = index;
    }
    this.lastMessageInBulk = message;
    this.mailBulk.push(message);
    this.scrollToSelectedMessage(message)
  }

  scrollToSelectedMessage(message: MailMessage) {
    let mailList;
    mailList = document.getElementById(this.list === 'topicList' ? 'mail-list' : 'search-list');
    if (this.mailBulk.length > 2 || window['event'] && ((window['event']['keyCode'] === 40) || (window['event']['keyCode'] === 38))) {
      const mailListItem = document.getElementById(message.id);
      if (mailList && mailListItem) {
        const currentHeight = 220;
        let mailListRect = mailList.getBoundingClientRect();
        let mailListItemRect = mailListItem.getBoundingClientRect();
        let listTop = this.list === 'topicList' ? mailListItemRect.top : (mailListItemRect.top - mailListRect.height);
        let bufferSpace = mailListItemRect.height;
        if (listTop > mailListRect.height) {
          mailList.scrollTop = mailList.scrollTop + mailListItemRect.height + bufferSpace;
        } else if(listTop < currentHeight) {
          let scrollPosition = mailList.scrollTop - mailListItemRect.height - bufferSpace;
          mailList.scrollTop = scrollPosition < 0 ? 0 : scrollPosition;
        }
      }
    }
  }


  clearBulk() {
    this.mailBulk.forEach((message, i) => {
      message['inBulk'] = false;
    });
    this.mailBulk = [];
    this.lastMessageInBulk = null;
    this.lastMessageInBulkIndex = 0
  }

  _isInBulk(message: MailMessage): boolean {
    if (this.mailBulk.indexOf(message) !== -1) {
      return true;
    }
    return false;
  }

  removeFromBulk(message: MailMessage, index): void {
    message['inBulk'] = false;
    this.mailBulk.splice(this.mailBulk.indexOf(message), 1);

    if (this.mailBulk.length === 0) {
      this.lastMessageInBulkIndex = index;
      this.lastMessageInBulk = null;
    }
    else if (this.lastMessageInBulkIndex <= this.selectedMessageIndex) {
      this.lastMessageInBulkIndex = index + 1
    }
    else {
      this.lastMessageInBulkIndex = index - 1;
    }
    this.scrollToSelectedMessage(message)
  }

  selectMultipleMessagesForBulk(start: number, finish: number): void {
    this.messages.forEach((message, index) => {
      if (index >= start && index <= finish) {
        this.selectForBulk(message);
      }
    })
  }

  deleteAllInBulk() {
    this.mailService.moveMessages(this.mailBulk, 'trash')
      .then(data => {
        this.messages = data.slice((this.mailListPaginationConfig.limit * (this.mailListPaginationConfig.page - 1)), this.mailListPaginationConfig.limit * this.mailListPaginationConfig.page);
        this.clearBulk();
        this.selectMessage(this.messages[this.selectedMessageIndex], this.selectedMessageIndex);
      });

  }

  bulkChanges(event) {
    if (event.length < 1) {
      this.clearBulk();
    }
  }

  openMessageModal(message) {
    this.ga.trackEvent('mail-list', 'open-email');
    this.modalService.mailContent(message);
  }

  /**
   * Split area size
   * - Set default state
   * - Handle drag changes
   */

  private setDefaultSplitAreaSize() {
    this.splitAreaSize.mailList = Number(localStorage.getItem('mail.size.mailList')) || 25;
    this.splitAreaSize.knowledgePanel = Number(localStorage.getItem('mail.size.knowledgePanel')) || 30;
    this.splitAreaSize.mailListSearchVertical = Number(localStorage.getItem('mail.size.mailListSearchVertical')) || 50;
  }

  onDragEnd(splitSizes: Array<number>) {
    // splitSizes[1] - mail content will calc auto
    this.splitAreaSize.mailList = splitSizes[0];
    this.splitAreaSize.knowledgePanel = splitSizes[2];
    // Save to local storage
    localStorage.setItem('mail.size.mailList', String(this.splitAreaSize.mailList));
    localStorage.setItem('mail.size.knowledgePanel', String(this.splitAreaSize.knowledgePanel));
  }

  onDragEndVertical(splitSizes: Array<number>) {
    if (this.search) {
      // splitSizes[0] - mail list will calc auto
      this.splitAreaSize.mailListSearchVertical = splitSizes[1];
      // Save to local storage
      localStorage.setItem('mail.size.mailListSearchVertical', String(this.splitAreaSize.mailListSearchVertical));
    } else {
      this.splitAreaSize.pinnedMessage = splitSizes[0];
      localStorage.setItem('mail.size.pinnedMessages', String(this.splitAreaSize.pinnedMessage));
    }
  }

}
