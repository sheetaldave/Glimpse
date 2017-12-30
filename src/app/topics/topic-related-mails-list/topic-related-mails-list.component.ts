import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MailListComponent } from '../../mail/mail-list/mail-list.component';
import { Clipboard } from 'ts-clipboard';
import { MailMessage } from '../../mail/mail-message';

@Component({
  selector: 'app-topic-related-mails-list',
  templateUrl: 'topic-related-mails-list.component.html',
  styleUrls: ['topic-related-mails-list.component.css']
})

export class TopicRelatedMailsListComponent extends MailListComponent implements OnInit, OnChanges {
  @Input() messages;
  @Input() minimizedMailboxMenu;
  @Input() selectedContact;
  @Input() selectedTopic;

  topic: string;
  contactList;
  totalMessages;
  totalMailsForConnection;
  show: boolean = false;

  ngOnChanges(changes) {
    if (changes.query) {
      if (changes.query.currentValue) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(this.query) == false) {
          this.topic = this.query;
          this.getMessagesFromTopic();
        } else {
          this.selectedContact = this.query;
          this.getMailsFromContact();
        }
      }
    }

    if (changes.selectedTopic) {
      if (changes.selectedTopic.currentValue === null) {
        this.subscribeToRouting();
      }
      if (changes.selectedTopic.currentValue) {
        this.topic = this.selectedTopic.name;
        this.getMessagesFromTopic();
      }
    }
    if (changes.selectedContact) {
      if (changes.selectedContact.currentValue && (this.query || this.selectedTopic)) {
        this.getMessagesFromSelectedEmailAndTopic();
      } else if (changes.selectedContact.currentValue) {
        this.getMailsFromContact();
      }
    } else if (this.selectedContact && this.selectedTopic) {
      if (changes.selectedTopic === undefined) {
        this.getMailsFromContact();
      } else {
        this.getMessagesFromTopic();
      }
    }
  }

  selectForModal(message : MailMessage) {
    this.modalService.mailContent(message);
  }

  composeNewMessage(e) {
    this.ga.trackEvent('topic-mail-list', 'compose-mail');
    this.modalService.compose(undefined, undefined, e);
  }

  copyToClipBoard(e) {
    Clipboard.copy(e);
  }

  /*get messages for topic from orchestra-topic*/
  getMessagesFromTopic() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.selectedContact) {
      this.messages = [];
    }
    this.topicService.getMessagesFromTopic(this.topic)
      .then((data: any) => {
        this.messages = data.messages;
        this.totalMessages = data.count;
      });
  }

  /*get more messages for topic from orchestra-topic*/
  loadMoreMessagesFromTopic() {
    this.loading = true;
    this.topicService.getMessagesFromTopic(this.topic, this.messages.length)
      .then((data: any) => {
        this.loading = false;
        if (data.messages) {
          this.messages.push(...data.messages);
        }
      });
  }

  showTopics(index) {
    this.selectedIndex = index;
    this.show = !this.show;
  }

  /*get Mails for selected contact from topic-orchestra*/
  getMailsFromContact() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.selectedTopic) {
      this.messages = [];
    }
    if (this.query) {
      this.topicService.getMessagesForSelectedContact(this.selectedContact)
        .then((data: any) => {
          this.loading = false;
          this.messages = data.messages;
          this.totalMailsForConnection = data.count;
        })
    } else {
      this.loading = true;
      this.topicService.getMessagesForSelectedContact(this.selectedContact.email)
        .then((data: any) => {
          this.loading = false;
          this.messages = data.messages;
          this.totalMailsForConnection = data.count;
        })
    }
  }

  /*get more mails for selected contact from topic-orchestra*/
  getMoreMessagesForSelectedContact() {
    if (this.query) {
      this.loading = true;
      this.topicService.getMessagesForSelectedContact(this.query, this.messages.length)
        .then((data: any) => {
          this.loading = false;
          if (data.messages) {
            this.messages.push(...data.messages);
          }
        });
    } else {
      this.loading = true;
      this.topicService.getMessagesForSelectedContact(this.selectedContact.email, this.messages.length)
        .then((data: any) => {
          this.loading = false;
          if (data.messages) {
            this.messages.push(...data.messages);
          }
        });
    }
  }

  getMessagesFromSelectedEmailAndTopic() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.loading = true;
    this.topicService.getMessagesFromEmailAndTopic(this.selectedContact.email, this.topic)
      .then((data: any) => {
        this.loading = false;
        this.messages = data.messages;
      });
  }

  getMoreMessagesFromSelectedEmailAndTopic() {
    this.loading = true;
    this.topicService.getMessagesFromEmailAndTopic(this.selectedContact.email, this.topic, this.messages.length)
      .then((data: any) => {
        this.loading = false;
        if (data.messages) {
          this.messages.push(...data.messages);
        }
      });
  }

  loadMoreMessages(): void {
    if (this.loading) {
      return;
    }
    if (this.selectedContact) {
      if (this.selectedContact && (this.topic || this.selectedTopic)) {
        this.getMoreMessagesFromSelectedEmailAndTopic();
      } else {
        this.getMoreMessagesForSelectedContact();
      }
      return;
    }
    if (this.selectedTopic || this.topic) {
      this.loadMoreMessagesFromTopic();
      return;
    }
  }

  showRelatedEmails(query: string): void {
    this.router.navigate(['/mail/search'], { queryParams: { q: query} });
  }

  showRelatedTopics(query: string): void {
    this.router.navigate(['/insights/search'], { queryParams: { q: query} });
  }
}
