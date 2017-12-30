import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../mail/contact';
import { ModalService } from '../mail/modals/modal.service';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnChanges {

  @Input() contact: Contact;
  @Input() showPopover: boolean = false;
  @Input() contextMenu: boolean = false;
  @Output() onLoadInKnowledgePanel = new EventEmitter();
  popoverTriggers: string = '';
  avatar: string;
  colors: Array<string> = [ '#1abc9c', '#3498db', '#f1c40f', '#8e44ad', '#e74c3c', '#d35400', '#2c3e50', '#7f8c8d'];
  color: string;
  constructor(private modalService: ModalService,
              private router: Router,
              private ga: GoogleAnalyticsService) {
    }

  ngOnChanges() {
    this.getAvatarLetters();
    this.getPopoverTextAndConfig();
  }

  getPopoverTextAndConfig(): void {
    if (this.showPopover && this.contact) {
      this.popoverTriggers = 'mouseenter:mouseleave';
    } else {
      this.popoverTriggers = null;
    }
  }

  getAvatarLetters(): void {
    if (!this.contact) {
      this.avatar = '';
      this.color = this.colors[0];
      return;
    }
    if (this.contact.name || this.contact.email) {
      const pattern = /\b(\w)/g;
      let text = '';

      if (this.contact.name && pattern.test(this.contact.name)) {
        text = this.contact.name;
      } else {
        text = this.contact.email;
      }

      const asciiCodeSum = text.split('').map(letter => letter.charCodeAt(0)).reduce((previous, current) => previous + current);

      this.avatar = text.match(pattern).slice(0, 2).join('').toUpperCase();
      this.color = this.colors[asciiCodeSum % this.colors.length];
    }
  }

  copyEmail() {
    this.ga.trackEvent('user-avatart-context-menu', 'copy-email');
    const email = this.contact.email;
    document.addEventListener('copy', (event: ClipboardEvent) => {
      event.clipboardData.setData('text/plain', email);
      event.preventDefault();
    });
    document.execCommand('copy');
  }

  sendNewEmail() {
    this.ga.trackEvent('user-avatart-context-menu', 'compose-mail');
    this.modalService.compose(undefined, undefined, this.contact);
  }

  openRelatedEmails() {
    this.ga.trackEvent('user-avatart-context-menu', 'related-emails');
    this.router.navigate(['/mail/search/contact/' + this.contact.email], {});
  }

  openRelatedTopics() {
    this.ga.trackEvent('user-avatart-context-menu', 'related-topics');
    this.router.navigate(['/insights/search'], { queryParams: { q: this.contact.email} });
  }

  loadInKnowledgePanel() {
    this.ga.trackEvent('user-avatart-context-menu', 'open-knowledge-pane');
    this.onLoadInKnowledgePanel.emit();
  }


}
