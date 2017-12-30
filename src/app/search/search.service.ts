import { Injectable } from '@angular/core';
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { environment } from "../../environments/environment";
import { MailMessage } from '../mail/mail-message';

@Injectable()
export class SearchService {


  constructor(private authHttp: AuthHttp) { }

  searchMessages(query: string, type: string, limit?: number, offset?: number) {
    if (type === 'keyword') {
      return this.authHttp.post(environment.baseUrl+'/api/mail/search', {
          query: query,
          limit: limit || 20,
          offset: offset || 0
        })
        .toPromise()
        .then(response => {
          const result = response.json().data as {messages: MailMessage[], count: number};
          return Promise.resolve(result);
        })
        .catch(err => {
          console.log(err);
          return Promise.resolve([]);
        })
    } else {
      let filters = {
        limit: limit || 20,
        offset: offset || 0
      };
      switch (type) {
        case 'topic':
          filters['topic'] = query;
          break;
        case 'contact':
          filters['email'] = query;
          break;
        default:
          console.log("Unsupported search type");
          return Promise.resolve([]);
      }
      return this.authHttp.get(environment.baseUrl+"/api/mail/messages", {params: filters})
        .toPromise()
        .then(response => {
          const result = response.json().data as {messages: MailMessage[], count: number};
          return Promise.resolve({messages:result.messages, count:result.count});
        })
        .catch(err => {
          console.log(err);
          return Promise.resolve([]);
        })
    }
  }

  searchTopics(query: string) {
    return this.authHttp.post(environment.baseUrl+'/api/topics/search', {query: query})
      .toPromise()
      .then(res => Promise.resolve(res.json().data))
      .catch(err => Promise.resolve(err))
  }

  showHistory(q) {
    return this.authHttp.post(environment.baseUrl+'/api/mail/search/history', {query: q})
      .toPromise()
      .then(res => Promise.resolve(res.json().data))
      .catch(err => Promise.resolve(err))
  }
}
