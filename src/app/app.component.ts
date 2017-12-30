import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from './google-analytics.service';
import { PushNotificationsService } from './push-notifications.service';
import { AuthService } from './auth/auth.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(public router: Router,
              private authService: AuthService,
              private accountService: AccountService,
              private ga: GoogleAnalyticsService,
              private pushNotifications: PushNotificationsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga.trackPage(event.urlAfterRedirects);
      }
    });

    authService.authenticated.subscribe(authenticated => {
      if (authenticated) {
        this.pushNotifications.register();
        this.accountService.getAccount()
          .subscribe(account => this.pushNotifications.setUser(account.id));
      }
    });
  }
}
