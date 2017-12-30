import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Recipient} from '../mail-message';
import {PopoverDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-contacts-counter-dropdown',
  templateUrl: './contacts-counter-dropdown.component.html',
  styleUrls: ['./contacts-counter-dropdown.component.less']
})
export class ContactsCounterDropdownComponent implements OnChanges {

  @Input() contactList: Array<Recipient>;
  @Input() selectedContact: Recipient;
  @Input() minContactLen: number = 2;
  @Output() selectedContactChange = new EventEmitter<Recipient>();
  @ViewChild('pop') dropDownContacts: PopoverDirective;

  visibleContacts: Array<Recipient> = [];
  hiddenContactsState: Array<Recipient> = [];

  // TODO: Should be replaced with forEach or Lodash method isEqual for any IE support
  /**
   * Check if selected element exist in current contact list with avatars
   * for instance (TO || CC || BCC)
   * @param {Array<Recipient>} contacts
   * @param {Recipient} searchContact
   * @returns {Recipient | undefined}
   */
  private findContact (contacts: Array<Recipient>, searchContact: Recipient): Recipient | undefined {
    return contacts.find(contact => contact.email === searchContact.email);
  }

  constructor() { }

  ngOnChanges() {
    this.visibleContacts = this.contactList.slice(0, this.minContactLen);
    this.hiddenContactsState = this.contactList.slice(this.minContactLen, undefined);

    if (!this.selectedContact || !this.findContact(this.contactList, this.selectedContact)) {
      return;
    }

    if (!this.findContact(this.visibleContacts, this.selectedContact)) {
      this.visibleContacts.push(this.selectedContact);
    }

    // TODO: findIndex should be replaced with method from Lodash or covered by polyfill for any IE support
    if (this.findContact(this.hiddenContactsState, this.selectedContact)) {
      const indexSelected = this.hiddenContactsState.findIndex((contact: Recipient) => contact.email === this.selectedContact.email);

      this.hiddenContactsState.splice(indexSelected, 1);
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

  selectCollapsedContact(contact: Recipient) {
    this.selectContact(contact);
    this.dropDownContacts.hide();
  }
}

