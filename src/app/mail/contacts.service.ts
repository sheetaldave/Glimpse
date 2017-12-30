/**
 * Created by lenovo on 7/19/2017.
 */
import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';

import {environment} from '../../environments/environment'

import 'rxjs/add/operator/toPromise';
import {Contact} from "./contact";
import {File} from "./file";


@Injectable()
export class ContactsService {

  contact: Contact;

  constructor(private authHttp: AuthHttp) {
  }


  getContacts(limit?, offset?) {
    return this.authHttp.get(environment.baseUrl + "/api/contacts", {params : { limit, offset }})
      .toPromise()
      .then(response => response.json())
      .catch(error => {console.error(error)});
  }

  getSelectedContact(email) {
    return this.authHttp.get(environment.baseUrl + "/api/contacts", {params : { filter: email }})
      .toPromise()
      .then(response => response.json())
      .catch(error => {console.error(error)});
  }

  getContactInfo(email, loadDataLimit): Promise<Contact> {
    return this.authHttp.get(environment.baseUrl + "/api/contacts/" + email, {
      params: loadDataLimit
    })
      .toPromise()
      .then(response => {
        const result = response.json() as {contact: Contact};
        if (!result)
          return Promise.resolve({} as Contact);
        else {
          return Promise.resolve(result.contact);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve({} as Contact);
      })
  }

  getMoreContactFiles(email: string, type: string, offset: number, limit: number): Promise<File[]> {
    return this.authHttp.get(environment.baseUrl + "/api/contacts/" + email + "/files/" + type, {
      params: {
        offset,
        limit
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data as File[];
        if (!result)
          return Promise.resolve([] as File[]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([] as File[]);
      })
  }

  getMoreContactConnections(email: string, offset: number, limit: number): Promise<object[]> {
    return this.authHttp.get(environment.baseUrl + "/api/contacts/" + email + "/connections", {
      params: {
        offset,
        limit
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data as object[];
        if (!result)
          return Promise.resolve([] as object[]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([] as object[]);
      })
  }

  getMoreContactTopics(email: string, offset: number, limit: number): Promise<object[]> {
    return this.authHttp.get(environment.baseUrl + "/api/contacts/" + email + "/topics", {
      params: {
        offset,
        limit
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data as object[];
        if (!result)
          return Promise.resolve([] as object[]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([] as object[]);
      })
  }

  getMoreContactRelatedData(email, includeAllCollection, loadDataLimit ,type): Promise<Contact> {
    return this.authHttp.get(environment.baseUrl + "/api/contacts/" + email, {
      params: {
        includeAllCollection,
        loadDataLimit,
        type
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json() as {contact: Contact};
        if (!result)
          return Promise.resolve({} as Contact);
        else {
          return Promise.resolve(result.contact);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve({} as Contact);
      })
  }
}
