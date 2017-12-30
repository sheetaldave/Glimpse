import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../modals/modal.service';
import { KnowledgeGraphService } from '../knowledge-graph.service';
import { KnowledgeGraphRelatedInfo } from '../knowledge-graph-related-info';
import { AccountService } from '../../account/account.service';
import { Account } from '../../account/account';
import { MailMessage, Recipient } from '../mail-message';
import { MailTopic } from '../mail-topic';
import { File } from '../file';
import { Contact } from '../contact';
import { GoogleAnalyticsService } from '../../google-analytics.service';

@Component({
  selector: 'app-mail-knowledge',
  templateUrl: './mail-knowledge.component.html',
  styleUrls: ['./mail-knowledge.component.css']
})
export class MailKnowledgeComponent implements OnInit {

  private _message: MailMessage;
  @Input()
  set message(message: MailMessage) {
    if (this._message !== message) {
      this._message = message;
      this._topic = null;
      if (this.initialized) {
        this.selectContact(null);
      }
      this.updateDropdownParticipants();
    }
  }
  get message(): MailMessage {
    return this._message;
  }
  private _topic: string;
  @Input()
  set topic(topic: string) {
    if (this._topic !== topic){
      this._topic = topic;
      if (this.initialized && this.mode == 'context') {
        this.loadRelatedInfo();
      }
    }
  }
  get topic() {
    return this._topic;
  }
  @Input()
  set contact(contact: Recipient) {
    if (this.initialized) {
      this.selectContact(contact);
    } else {
      this.selectedContact = contact;
      this.updateDropdownParticipants();
    }
  }

  @Output('contactChange') selectedContactChange = new EventEmitter<Recipient>();
  @Input() contactOnly: boolean = false;

  relatedInfo: KnowledgeGraphRelatedInfo;
  orders: string[] = ['Date', 'Subject', 'Thread', 'Sender', 'Attachments'];
  selectedOrder: string = 'Date';
  initialized: boolean = false;
  selectedTab: string;
  mode: string;
  selectedContact: Recipient;
  selectedTopic: string;
  selectedConnection: Recipient;
  filesType: string;
  pageSizes: {
    topics: number;
    connections: number;
    messages: number;
    images: number;
    allTypes: number;
    documents: number;
    videos: number;
  };
  loaders: {
    global: boolean;
    topics: boolean;
    connections: boolean;
    messages: boolean;
    allTypes: boolean;
    images: boolean;
    videos: boolean;
    documents: boolean;
  };
  dropdownParticipants: Recipient[];
  splitAreaSize = {
    topics: null,
    contacts: null
  };

  constructor(private kowledgeGraphService: KnowledgeGraphService,
              private modalService: ModalService,
              private accountService: AccountService,
              private router: Router,
              private ga: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mode = this.contactOnly ? 'all' : 'context';
    this.selectedTab = this.contactOnly ? 'contacts' : 'message';
    this.filesType = 'allTypes';
    this.pageSizes = {
      topics: 15,
      connections: 7,
      messages: 15,
      allTypes: 10,
      images: 9,
      documents: 6,
      videos: 2
    };
    this.loaders = {
      global: false,
      topics: false,
      connections: false,
      messages: false,
      allTypes: false,
      images: false,
      videos: false,
      documents: false,
    };
    this.selectedContact = this.selectedContact || null;
    this.selectedTopic = null;
    this.selectedConnection = null;
    this.relatedInfo = null;
    this.initialized = true;
    if (this.message || (this.contactOnly && this.selectContact)) {
      this.loadRelatedInfo();
    }
    this.setDefaultSplitAreaSize();
  }

  /**
   * Split area size
   * - Set default state
   * - Handle drag changes
   */

  private setDefaultSplitAreaSize() {
    this.splitAreaSize.topics = Number(localStorage.getItem('knowledgePanel.size.topics'));
    this.splitAreaSize.contacts = Number(localStorage.getItem('knowledgePanel.size.contacts'));
  }

  onDragEnd(splitSizes: Array<number>) {
    // Update values
    this.splitAreaSize.topics = splitSizes[0];
    this.splitAreaSize.contacts = splitSizes[1];
    // Save to local storage
    localStorage.setItem('knowledgePanel.size.topics', String(this.splitAreaSize.topics));
    localStorage.setItem('knowledgePanel.size.contacts', String(this.splitAreaSize.contacts));
  }

  /**
   * Select tab button and change content
   * @param tab Can contain the following values: 'message', 'contacts'
   */
  selectTab(tab: 'message' | 'contacts') {
    if (this.selectedTab === tab) {
      return;
    }
    this.selectedTab = tab;
    this.ga.trackEvent('knowledge-pane-action', 'switch-tab');
    if (this.selectedTab === 'message') {
      this.selectContact(null);
      this.mode = 'context';
    } else if (this.selectedTab === 'contacts' && this.selectedContact === null) {
      var firstContact = this.message.participants[0];
      this.selectContact(firstContact);
    }
    this.loadRelatedInfo();
  }

  switchMode(mode: string) {
    this.mode = mode;
    this.loadRelatedInfo();
  }

  selectSenderContact(contact: Recipient){
    this.ga.trackEvent('knowledge-pane-action', 'switch-sender-dropdown');
    this.selectContact(contact)
  }

  selectContact(contact: Recipient) {
    this.selectedContact = contact;
    this.selectedContactChange.emit(contact);
    this.updateDropdownParticipants();
    if (this.selectedContact === null) {
      this.mode = 'context';
      this.selectedTab = 'message';
    } else {
      this.selectedTab = 'contacts';
    }
    this.loadRelatedInfo();
  }

  selectTopic(topic: string) {
    this.ga.trackEvent('knowledge-pane-action', 'select-related-topic');
    if (this.selectedTopic === topic) {
      this.selectedTopic = null;
      this.selectedConnection = null;
    } else {
      this.selectedTopic = topic;
      this.selectedConnection = null;
    }
    this.loadRelatedConnections(false);
    this.loadRelatedMessages(false);
    this.loadRelatedFiles('images', false);
    this.loadRelatedFiles('videos', false);
    this.loadRelatedFiles('documents', false);
    this.loadRelatedFiles('allTypes', false);
  }

  selectConnection(connection: Recipient) {
    this.ga.trackEvent('knowledge-pane-action', 'select-related-connection');
    if (this.selectedConnection === connection) {
      this.selectedConnection = null;
    } else {
      this.selectedConnection = connection;
    }
    this.loadRelatedMessages(false);
    this.loadRelatedFiles('images', false);
    this.loadRelatedFiles('videos', false);
    this.loadRelatedFiles('documents', false);
    this.loadRelatedFiles('allTypes', false);
  }

  private getFilters() {
    return {
      messageId: this.message && this.mode === 'context' ? this.message.id : null,
      topic:  this.mode === 'context' ? this.topic : null,
      contact: this.selectedContact,
      relatedTopic: this.selectedTopic,
      relatedContact: this.selectedConnection,
      mailOrder: this.selectedOrder
    };
  }

  loadRelatedInfo() {
    this.loaders.global = true;
    this.selectedTopic = null;
    this.selectedConnection = null;
    this.accountService.getAccount()
      .subscribe((account: Account) => {
        const filters = this.getFilters();
        filters['ignoreContact'] = {email: account.email};
        this.kowledgeGraphService.getRelatedInfo(filters, this.pageSizes)
          .subscribe((relatedInfo: KnowledgeGraphRelatedInfo) => {
            this.loaders.global = false;
            this.relatedInfo = relatedInfo;
          });
      })
  }

  loadRelatedTopics(more: boolean = true) {
    if (!more) {
      this.relatedInfo.topics = {data: [], count:0};
    }
    this.loaders.topics = true;
    this.kowledgeGraphService.getRelatedTopics(
      this.getFilters(),
      this.pageSizes.topics,
      this.relatedInfo.topics.data.length
     )
    .subscribe((topics: {data: string[], count: number}) => {
      this.loaders.topics = false;
      this.relatedInfo.topics.data.push(...topics.data);
      this.relatedInfo.topics.count = topics.count;
    })
  }

  loadRelatedConnections(more: boolean = true) {
    if (more && this.loaders.connections === true) {
      return;
    }
    if (!more) {
      this.relatedInfo.connections = {data: [], count: 0};
    }
    this.loaders.connections = true;
    this.accountService.getAccount()
      .subscribe((account: Account) => {
        const filters = this.getFilters();
        filters['ignoreContact'] = {email: account.email};
        this.kowledgeGraphService.getRelatedConnections(
          filters,
          this.pageSizes.connections,
          this.relatedInfo.connections.data.length
         )
        .subscribe((connections: {data: Recipient[], count: number}) => {
          this.loaders.connections = false;
          this.relatedInfo.connections.data.push(...connections.data);
          this.relatedInfo.connections.count = connections.count;
        })
      })
  }

  selectOrder(order: string) {
    this.selectedOrder = order;
    this.loadRelatedMessages(false);
  }

  loadRelatedMessages(more: boolean = true) {
    if (!more) {
      this.relatedInfo.messages = {data: [], count:0};
    }
    else {
      this.ga.trackEvent('knowledge-pane-action', 'load-more-mails');
    }
    this.loaders.messages = true;
    this.kowledgeGraphService.getRelatedMessages(this.getFilters(), this.pageSizes.messages, this.relatedInfo.messages.data.length)
      .subscribe((messages: {data: MailMessage[], count: number}) => {
        this.loaders.messages = false;
        this.relatedInfo.messages.data.push(...messages.data);
        this.relatedInfo.messages.count = messages.count;
      })
  }

  loadRelatedFiles(type: string, more: boolean = true) {
    if (!more) {
      this.relatedInfo.files[type] = {data: [], count:0};
    }
    this.loaders[type] = true;
    this.kowledgeGraphService.getRelatedFiles(
      type,
      this.getFilters(),
      this.pageSizes[type],
      this.relatedInfo.files[type].data.length
     )
    .subscribe((files: {data: File[], count: number}) => {
      this.loaders[type] = false;
      this.relatedInfo.files[type].data.push(...files.data);
      this.relatedInfo.files[type].count = files.count;
    })
  }

  openMessage(message: MailMessage) {
    this.ga.trackEvent('knowledge-pane-action', 'open-email');
    this.modalService.mailContent(message);
  }

  // Actions for context menu of topics and connections, @TODO: move to separate component or so
  showRelatedEmails(query: string): void {
    this.router.navigate(['/mail/search/topic/' + query]);
  }

  showRelatedTopics(query: string): void {
    this.router.navigate(['/insights/search'], { queryParams: { q: query} });
  }

  updateDropdownParticipants() {
    if (!this.message) {
      this.dropdownParticipants = null;
      return;
    }
    if (!this.selectedContact) {
      this.dropdownParticipants = this.message.participants;
      return;
    }
    this.dropdownParticipants = this.message.participants.filter(participant => {
      return !((participant.name === this.selectedContact.name) && (participant.email === this.selectedContact.email));
    });
  }
}
