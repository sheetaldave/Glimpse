import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {GoogleApiConfig, GapiInitConfigs} from './google-config';
import {environment} from '../../environments/environment';

@Injectable()
export class GoogleApiService {
  private readonly gapiUrl: string = 'https://apis.google.com/js/platform.js';
  private isLoaded: boolean = false;
  private config: GoogleApiConfig;

  constructor() {
    this.config = new GoogleApiConfig({
      clientId: environment.socialAuth.google.clientId,
      discoveryDocs: [],
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/ https://www.google.com/m8/feeds https://www.googleapis.com/auth/calendar'
    });
    this.loadGapi();
  }

  public onLoad(callback: () => any) {
    if (this.isLoaded) {
      callback();
      return;
    }
    this.loadGapi().subscribe(callback);
  }

  public getConfig(): GoogleApiConfig {
    return this.config;
  }

  private loadGapi(): Observable<void> {
    return Observable.create((observer: any) => {
      const node = document.createElement('script');
      node.src = this.gapiUrl;
      node.type = 'text/javascript';
      node.async = true;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = () => {
        observer.next();
        this.isLoaded = true;
      };
    });
  }
}
