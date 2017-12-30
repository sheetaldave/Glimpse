import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { GoogleAuthService } from './google-auth.service';

import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment } from '../../environments/environment';

import GoogleAuth = gapi.auth2.GoogleAuth;
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authenticated: BehaviorSubject<boolean>;

  constructor(private http: Http, private googleAuth: GoogleAuthService, private authHttp: AuthHttp) {
    this.authenticated = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  _authenticate(token: string) {
    localStorage.setItem('token', token);
    this.authenticated.next(true);
  }

  signOut(): Promise<boolean> {
    localStorage.removeItem('token');
    this.authenticated.next(false);

    return this.authHttp.get(environment.baseUrl + '/api/auth/logout')
      .toPromise()
      .then(res => Promise.resolve(true))
      .catch(err => Promise.resolve(false));
  }

  googleSignIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.googleAuth.getAuth().subscribe((auth) => {
            auth.grantOfflineAccess({prompt: 'consent'})
              .then(res => {
                this.http.post(environment.baseUrl + '/api/auth/google', {
                  code: res.code,
                  redirect_uri: window.location.origin
                }, {withCredentials: true})
                  .toPromise()
                  .then(data => {
                    const response = data.json();
                    const token = response.token;
                    const isAccountReady = response.account_ready;
                    if (!token) {
                      return reject('No token received');
                    }
                    this._authenticate(token);
                    return resolve(isAccountReady);
                  })
                  .catch(err => {
                    if (err.status === 403 && err.json().error_code === 'email_not_allowed') {
                      return reject('email_not_allowed');
                    }
                    return reject(err.json().error || 'Unexpected error occured');
                  });
              }, err => {
                return reject(new Error('Please, enable 3rd party cookies in your browser and refresh the web page'));
            });
          },
          err => reject(err.error)
        );
      }
    );
  }
}
