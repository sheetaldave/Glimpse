import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-side-bar',
  templateUrl: './account-side-bar.component.html',
  styleUrls: ['./account-side-bar.component.css']
})
export class AccountSideBarComponent implements OnInit {

  sections = [
    {
      name: 'Overview',
      route: 'overview',
      icon: 'user'
    }, {
      name: 'Signatures',
      route: 'signatures',
      icon: 'pencil-square-o'
    }, {
      name: 'Delayed send',
      route: 'delayed-send',
      icon: 'mail-reply'
    }, {
      name: 'Reply templates',
      route: 'quick-reply-templates',
      icon: 'mail-reply'
    }, {
      name: 'Auto reply',
      route: 'auto-replies',
      icon: 'commenting'
    }, {
      name: 'Mail rules',
      route: 'mail-rules',
      icon: 'envelope'
    }, {
      name: 'Desktop Notifications',
      route: 'web-push-notifications',
      icon: 'bell'
    }, {
      name: 'Cancel my Account',
      route: 'cancel',
      icon: 'ban'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
