import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions} from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import * as Raven from 'raven-js';

import { AppComponent } from './app.component';
import { GoogleAnalyticsService } from './google-analytics.service';
import { PushNotificationsService } from './push-notifications.service';

import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { TopicsModule } from './topics/topics.module';
import { AccountModule } from './account/account.module';
import { DateTimePickerModule} from 'ngx-datetime-picker';

import { environment } from '../environments/environment';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

if(environment.sentry.enabled) {
  Raven
    .config(environment.sentry.dsn)
    .install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    if(environment.sentry.enabled) {
      Raven.captureException(err);
    } else {
      console.error(err);
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AuthModule,
    MailModule,
    TopicsModule,
    AccountModule,
    AppRoutingModule,
    DateTimePickerModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: ErrorHandler,
      useClass: RavenErrorHandler
    },
    GoogleAnalyticsService,
    PushNotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
