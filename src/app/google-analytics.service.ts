import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

  constructor() { }

  trackPage(path: string) {
    ga('set', 'page', path);
    ga('send', 'pageview');
  }

  trackEvent(eventCategory: string,
             eventAction: string,
             eventLabel: string = null,
             eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }

  setUser( userID: string ) {
    ga('set', 'userId', userID);
  }
}
