import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/toPromise';
import { MailMessage } from "../mail/mail-message";

@Injectable()

export class TopicsService {

  constructor(private authHttp: AuthHttp) {
  }

  getTopics(date: number) {
    let filter = '';
    if(date) {
      filter = '?from_date=' + date;
    }
    return this.authHttp.get(environment.baseUrl+'/api/topics' + filter)
      .toPromise()
      .then(data => data.json())
      .catch(err => console.log(err))
  }

  getSimilarTopics(topicName:string) {
    return this.authHttp.get(environment.baseUrl+'/api/topics/'+topicName+'/similar')
      .toPromise()
      .then(data => data.json())
      .catch(err => console.log(err))
  }

  getTopicCounters(topicName:string) {
    return this.authHttp.get(environment.baseUrl + '/api/topics/counters/' + topicName)
      .toPromise()
      .then(data => data.json())
      .catch(err => console.log(err))
  };

  getContactsFromTopic(topic) {
    return this.authHttp.get(environment.baseUrl + "/api/topic/" + topic + "/contacts", {})
      .toPromise()
      .then(response => {
        const result = response.json();
        if (!result || result.hasOwnProperty('error'))
          return Promise.resolve({});
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve();
      })
  }

  getMoreContactsFromTopic(topic, startIndex) {
    return this.authHttp.get(environment.baseUrl + "/api/topic/" + topic + "/contacts", {
      params: {
        startIndex,
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json();
        if (!result || result.hasOwnProperty('error'))
          return Promise.resolve({});
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve();
      })
  }

  getMessagesFromTopic(topic, offset?) {
    return this.authHttp.get(environment.baseUrl + "/api/mail/messages", {
      params: {
        topic,
        offset
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data
        if (!result || result.hasOwnProperty('error'))
          return Promise.resolve([]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([]);
      })
  }

  getMessagesForSelectedContact(email, offset?) {
    return this.authHttp.get(environment.baseUrl + "/api/mail/messages" , {
      params: {
        email,
        offset
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data

        if (!result)
          return Promise.resolve([]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([]);
      })
  }

  getMessagesFromEmailAndTopic(email, topic , offset?){
    return this.authHttp.get(environment.baseUrl + "/api/mail/messages", {
      params: {
        email,
        topic,
        offset
      }
    })
      .toPromise()
      .then(response => {
        const result = response.json().data
        if (!result)
          return Promise.resolve([]);
        else {
          return Promise.resolve(result);
        }

      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([]);
      })
  }

}
