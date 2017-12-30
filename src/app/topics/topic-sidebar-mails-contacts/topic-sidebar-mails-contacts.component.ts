import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TopicsService } from "../topics.service";
import { MailMessage } from "../../mail/mail-message";
import 'rxjs/add/operator/switchMap';
import { Topic } from "../topic";
import { ContactsService } from "../../mail/contacts.service";
import { MailService } from "../../mail/mail.service";
import { Router } from "@angular/router";
import { Contact } from "../../mail/contact";
import { ModalService } from '../../mail/modals/modal.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';

@Component({
  selector: 'app-topic-sidebar-mails-contacts',
  templateUrl: 'topic-sidebar-mails-contacts.component.html',
  styleUrls: ['topic-sidebar-mails-contacts.component.css']
})

export class TopicSidebarMailsContactsComponent implements OnInit, OnChanges {

  @Input() selectedTopic : Topic ;
  @Input() query : string ;

  isTopicScreen = true
  messages : MailMessage[];
  selectedContact;
  connections;
  totalConnections;
  topic : string;
  folder :string;
  minimizedMailboxMenu = false;
  loading = false;
  splitSizes ={
    sidebar : 13,
    mailList : 62,
    contactList : 25,
  };
  noOfContacts = 10;
  contactForKnowledgePane: Contact[];

  constructor(private topicService : TopicsService,
              private contactsService : ContactsService,
              private mailService : MailService,
              private router: Router,
              private modalService: ModalService,
              private ga : GoogleAnalyticsService) { }


  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(changes.selectedTopic.currentValue === null){
      this.minimizedMailboxMenu = false;
      this.splitSizes.sidebar = 13;
      this.splitSizes.mailList = 59;
      this.splitSizes.contactList = 28
    }
    if(!this.selectedTopic && !this.query) {
        this.getMyContacts()
      }
      else {
      this.minimizedMailboxMenu = true;
      this.splitSizes.sidebar = 5;
      this.splitSizes.mailList = 7 + 60;
      this.splitSizes.contactList = 28;
      if(this.selectedTopic){
        this.topic = this.selectedTopic.name
        this.getContactFromTopic()
        return
      }
      if(this.query){
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(this.query) == false) {
          this.topic = this.query
          this.getContactFromTopic()
        }
        else {
          this.getSelectedContact();
        }

      }

    }
  }

  getSelectedContact(){
    this.contactsService.getSelectedContact(this.query)
      .then(contact =>{
        this.connections = contact.contacts;
        this.totalConnections = contact.total_count;
      })
  }

  getMyContacts() {
    this.contactsService.getContacts(this.noOfContacts, 0)
      .then(response => {
        this.connections = response.contacts;
        this.totalConnections = response.total_count;

      });
  }

  openKnowledgepane(contact: Contact) {
    this.modalService.knowledgePanel(contact);
  }

  composeNewMessage(e) {
    this.ga.trackEvent('topic-side-menu', 'compose-mail');
    this.modalService.compose(undefined, undefined, e);
  }

  showRelatedAttachments(query){

  }

  getMoreContacts() {
    if(this.selectedTopic){
        this.loadMoreTopicRelatedContacts()
    }
    else{
      this.contactsService.getContacts(this.noOfContacts, this.connections.length)
        .then(response => {
          response.contacts && this.connections.push(...response.contacts);
        });
    }

  }

  getContactFromTopic(){
    this.topicService.getContactsFromTopic(this.topic)
      .then(data => {
        this.connections = data.connections;
        this.totalConnections = data.total
      })
  }

  loadMoreTopicRelatedContacts(){
    this.topicService.getMoreContactsFromTopic(this.topic, this.connections.length)
      .then(data => {
        data.connections && this.connections.push(...data.connections);
      })
  }

  selectContact(contact){
    this.minimizedMailboxMenu = true;
    this.splitSizes.sidebar = 5;
    this.splitSizes.mailList = 9 + 58;
    this.splitSizes.contactList = 28;
    this.selectedContact = contact
  }
}
