import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { MailFolder } from './mail-folder';
import { MailMessage } from './mail-message';
import { MailTopic, MailTopicAnnotation } from './mail-topic';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Observable } from 'rxjs/Observable';
import { Response } from "@angular/http";

@Injectable()
export class MailService {
  folders: ReplaySubject<MailFolder[]>;
  selectNextMessage = new Subject<MailMessage[]>();
  selectNextMessage$ = this.selectNextMessage.asObservable();
  messages: {
    [folder: string]: {
      messages: MailMessage[],
      total_count: number
    }
  } = {};
  pinnedMessages: {
    [folder: string]: {
      messages: MailMessage[],
      total_count: number
    }
  } = {};
  order: string;
  lastFetchFolder: string;
  private folderList: MailFolder[];

  constructor(private authHttp: AuthHttp) {
    this.folders = new ReplaySubject<MailFolder[]>(1);
  }

  private onErrorHandler(error: Error): Promise<boolean> {
    console.error(error);
    return Promise.resolve(false);
  }

  private fetchFolders() {
    this.authHttp.get(environment.baseUrl + '/api/mail/folders').subscribe(
        response => {
          const folderList = response.json() as MailFolder[];
          this.folderList = folderList;
          this.folders.next(folderList);
        },
        this.onErrorHandler
      );
  }

  selectNextAvailableMessage(message) {
    this.selectNextMessage.next(message)
  }
  private findFolder(folderId: string): MailFolder | undefined {
    if (!this.folderList) {
      return;
    }
    const recursiveFindFolder = ((folderList: MailFolder[]): MailFolder | undefined => {
      for (const folder of folderList) {
        if (folder.id === folderId) {
          return folder;
        }
        if (folder.hasOwnProperty('sub_folders') && folder.sub_folders.length > 0) {
          const result = recursiveFindFolder(folder.sub_folders);
          if (result !== undefined) {
            return result;
          }
        }
      }
    });
    return recursiveFindFolder(this.folderList);
  }

  getFolders(): ReplaySubject<MailFolder[]> {
    this.fetchFolders();
    return this.folders;
  }

  createFolder(folderName): Promise<boolean> {
    const body = {
      display_name: folderName
    };

    return this.authHttp.post(environment.baseUrl + '/api/mail/folders/', body)
      .toPromise()
      .then(response => {
        this.fetchFolders();
        return Promise.resolve(true);
      })
      .catch(this.onErrorHandler);
  }

  renameFolder(folderId, folderName): Promise<boolean> {
    const body = {
      display_name: folderName
    };

    return this.authHttp.put(environment.baseUrl + '/api/mail/folders/' + folderId, body)
      .toPromise()
      .then(response => {
        this.fetchFolders();
        return Promise.resolve(true);
      })
      .catch(this.onErrorHandler);
  }

  deleteFolder(folderId): Promise<boolean> {
    return this.authHttp.delete(environment.baseUrl + '/api/mail/folders/' + folderId)
      .toPromise()
      .then(response => {
        this.fetchFolders();
        return Promise.resolve(true);
      })
      .catch(this.onErrorHandler);
  }

  _getMessages(folder: string, sortBy: string, limit?: number, offset?: number): Promise<{messages :MailMessage[], count: number}> {
    const params = {params: {folder: folder, sort_by: sortBy.toLowerCase(), limit: limit, offset: offset} };
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages', params)
      .toPromise()
      .then((response: Response) => {
        const result = response.json().data as {messages: MailMessage[], count: number};
        this.order = sortBy;
        this.lastFetchFolder = folder;
        this.messages[folder]['messages'] = this.messages[folder]['messages'].concat(result.messages);
        this.messages[folder]['total_count'] = (result.count);
        if (!this.messages[folder]) {
          return Promise.resolve({messages : [], count:0});
        } else {
          return Promise.resolve({messages: this.messages[folder]['messages'], count: result.count});
        }
      })
      .catch(error => {
        console.log(error);
        return Promise.resolve({messages : [], count:0});
      });
  }

  _getPinnedMessages(folder: string, sortBy: string, limit?: number, offset?: number): Promise<{pinnedMessages: MailMessage[], count: number}> {
    const params = {params: {folder: folder, sort_by: sortBy.toLowerCase(), limit: limit, offset: offset, pinned: true}};
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages', params)
      .toPromise()
      .then((response: Response) => {
        const result = response.json().data as {messages: MailMessage[], count: number};
        this.pinnedMessages[folder]['messages']=  this.pinnedMessages[folder]['messages'].concat(...result.messages);
        this.pinnedMessages[folder]['total_count']=  result.count;
        return Promise.resolve({pinnedMessages: this.pinnedMessages[folder]['messages'], count: result.count});
      })
      .catch(error => {
        console.log(error);
        return Promise.resolve({pinnedMessages : [], count:0});
      });
  }

  getMorePinnedMessages(folder: string, sortBy: string): Promise<{pinnedMessages: MailMessage[], count: number}> {
    if (!this.pinnedMessages[folder]) {
      this.pinnedMessages[folder] = {messages: [], total_count: 0};
    }
    return this._getPinnedMessages(folder, sortBy, 20, this.pinnedMessages[folder]['messages'].length);
  }

  getMessage(id: string): Promise<MailMessage> {
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages/' + id)
      .toPromise()
      .then((response: Response) => {
        const message = response.json().data as MailMessage;
        return Promise.resolve(message);
      })
      .catch(error => {
        console.log(error);
        return Promise.resolve(null);
      });
  }

  getPinnedMessages(folder: string, sortBy: string): Promise<{pinnedMessages: MailMessage[], count: number}> {
    if (this.pinnedMessages[folder] && this.pinnedMessages[folder]['messages'].length > 0 && this.order === sortBy) {
      this.lastFetchFolder = folder;
      return Promise.resolve({pinnedMessages : this.pinnedMessages[folder]['messages'], count: this.pinnedMessages[folder]['total_count']});
    }
    this.pinnedMessages[folder] = {messages: [], total_count: 0};
    return this._getPinnedMessages(folder, sortBy);
  }

  getMessages(folder: string, sortBy: string): Promise<{messages: MailMessage[], count: number}> {
    if (this.messages[folder] && this.messages[folder]['messages'].length > 0 && this.order === sortBy) {
      this.lastFetchFolder = folder;
      return Promise.resolve({messages : this.messages[folder]['messages'], count: this.messages[folder]['total_count']});
    }
      this.messages[folder] = {messages: [], total_count: 0};
     return this._getMessages(folder, sortBy);
    }


  getMoreMessages(folder: string, sortBy: string): Promise<{messages: MailMessage[], count:number}> {
    if (!this.messages[folder]) {
      this.messages[folder] = {messages: [], total_count: 0};
    }
    return this._getMessages(folder, sortBy,  20, this.messages[folder]['messages'].length);
  }

  getMessagesWithFilter(filters: {
    contact?: string,
    excludeFolders?: string[],
    includeFolders?: string[],
    topics?: string[],
    relatedTopics?: string[],
    relatedContacts?: string[],
    relatedMessages?: string[]
  }, limit: number, offset: number): Observable<{messages: MailMessage[], total_count: number}> {
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages', {params: {limit: limit, offset: offset} })
      .map(response => {
        return response.json().data as {messages: MailMessage[], total_count: number};
      });
  }

  getMessagesInThread(thread: string): Promise<MailMessage[]> {
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages', {params: {thread_id: thread}})
      .toPromise()
      .then((response: Response) => {
        const result = response.json().data as {messages: MailMessage[], total_count: number};
        return Promise.resolve(result.messages);
      })
      .catch(error => {
        console.log(error);
        return Promise.resolve([]);
      });
  }

  readUnreadMessage(message: MailMessage): Promise<boolean> {
    let that = this;
    return this.authHttp.put(environment.baseUrl + '/api/mail/messages/read', {message_id: message.id, unread: !message.unread})
      .toPromise()
      .then((response: Response) => {
        message.unread = !message.unread;
        this.updateMessageCache(message, 'update');
        this.updateFolderCount(message, message.unread ? 'increment' : 'decrement');
        return Promise.resolve(true);
      })
    .catch(this.onErrorHandler);
  }

  starMessage(message: MailMessage): Promise<boolean> {
    return this.authHttp.put(environment.baseUrl + '/api/mail/messages/star', {
      message_id: message.id,
      starred: !message.starred
    })
      .toPromise()
      .then((data: Response) => {
        message.starred = !message.starred;
        this.updateMessageCache(message, 'update');
        this.fetchFolders();
        return Promise.resolve(true);
      })
      .catch(this.onErrorHandler);
  }

  snoozeMessage(messageId: string): Promise<boolean> {
    const body = {
      id: messageId,
    };
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/snooze', body)
      .toPromise()
      .then(data => {
        return Promise.resolve(true);
      })
      .catch(error => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  sendMessage(message): Promise<{message: MailMessage, delay_send_job_id: string}> {
   let that = this;
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/send', {message})
      .toPromise()
      .then((data: Response) => {
        this.fetchFolders();
        return data.json().data;
      })
      .catch(this.onErrorHandler);
  }

  cancelMessage(jobId): Promise<boolean> {
    return this.authHttp.delete(environment.baseUrl + '/api/mail/messages/delayed/' + jobId)
      .toPromise()
      .then(data => {
        return Promise.resolve(true);
      })
      .catch(this.onErrorHandler);
  }

  saveMessageToDrafts(message): Promise<MailMessage> {
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/drafts', {message})
      .toPromise()
      .then(data => data.json())
      .catch(this.onErrorHandler);
  }

  uploadFile(file) {
    const fd = new FormData();
    const {name, size, type} = file;

    fd.append('file', file, name);
    return this.authHttp.post(environment.baseUrl + '/api/mail/files', fd)
      .toPromise()
      .then(data => Object.assign({}, data.json(), { name, size, type }))
      .catch(error => {
        return Promise.reject(error);
      });
  }

  getFile(file_id: string) {
    return this.authHttp.get(environment.baseUrl + '/api/mail/files/' + file_id)
      .toPromise()
      .then(data => data)
      .catch(this.onErrorHandler);
  }

  moveMessageToAnotherFolder(message: MailMessage, folderId: string) {
    const folder = this.findFolder(folderId);
    if (!folder) {
      console.error('Can`t find folder `${folder}` for move message');
      return Promise.resolve([]);
    }
    return this.authHttp.put(environment.baseUrl + '/api/mail/move-messages/' + message.id, {
      labels: folder.folder_id
    })
      .toPromise()
      .then((response: Response) => {
        const result = response.json();
        if (result.success === true) {

          this.fetchFolders();
          this.updateMessageCache(message, 'remove');
          delete this.messages[folder.name];
          return Promise.resolve(this.messages[this.lastFetchFolder].messages);
        }
      })
      .catch((err) => {
        console.log(err);
        return Promise.resolve([]);
      })
  }

  updateMessageCache(message: MailMessage, action: string) {
    Object.keys(this.messages).forEach(folder => {
      if (this.messages[folder] && this.messages[folder].messages.length) {

        if (action === 'remove') {
          const index = this.messages[folder].messages.findIndex((msg: MailMessage) => msg.id === message.id);
          this.messages[folder].messages.splice(index, 1);
        }
        if (action === 'update') {
          const index = this.messages[folder].messages.findIndex((msg: MailMessage) => msg.id === message.id);

          if (index > -1) {
            this.messages[folder].messages[index] = message;
          }
        }
      }
    });
  }

  updateFolderCount(message: MailMessage, action: 'increment' | 'decrement') {
    message.labels.forEach(messageFolder => {
      const folder = this.findFolder(messageFolder.name);
      if (folder) {
        switch (action) {
          case 'increment':
            folder.unreadMails++;
            break;
          case 'decrement':
            folder.unreadMails--;
            break;
          default:
            break;
        }
      }
    });
    this.folders.next(this.folderList);
  }

  addLabel(message: MailMessage, folderId: string) {
    const folder = this.findFolder(folderId);
    if (!folder) {
      console.error('Can`t find folder `${folder}` for add label to message');
      return Promise.resolve(false);
    }
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/' + message.id + '/labels'  , {
      label_id: folder.folder_id
    })
      .toPromise()
      .then((response: Response) => {
        const result = response.json();
        if (result.success === true) {
          delete this.messages[folder.name];
          return Promise.resolve(true);
        }
      });
  }

  getTopics(message: MailMessage, forceProcess: boolean = false): Promise<MailTopic[]> {
    let params = {};
    if (forceProcess) {
      params['force_process'] = true;
    }
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages/' + message.id + '/topics', {params})
      .toPromise()
      .then(res => res.json().data)
      .catch((err) => {
        console.log(err);
        return Promise.resolve([]);
      });
  }

  updateTopics(messageId: string, topics: MailTopic[]): Observable<boolean> {
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/' + messageId + '/topics', {topics})
      .map(response => response.json().success);
  }

  getTopicsAnnotations(messageId: string): Observable<{annotations: MailTopicAnnotation[], shareText: boolean}> {
    return this.authHttp.get(environment.baseUrl + '/api/mail/messages/' + messageId + '/topics/annotations')
      .map((res: Response) => {
        const data = res.json();
        return {
          annotations: data.annotations || [],
          shareText: data.shareText
        } as {annotations: MailTopicAnnotation[], shareText: boolean};
      });
  }

  saveTopicsAnnotations(messageId: string, annotations: MailTopicAnnotation[], shareText: boolean): Observable<boolean> {
    return this.authHttp.post(environment.baseUrl + '/api/mail/messages/' + messageId + '/topics/annotations', {annotations, shareText})
      .map(response => response.json().success);
  }

  getRecentMessages(): Observable<{messages :MailMessage[], count:number}> {
    let that = this;
    return IntervalObservable
      .create(environment.messageFetchInterval)
      .flatMap(() => {
        const messages = that.messages[that.lastFetchFolder]['messages'];
        const allMessages = this.sortByDate(messages.concat(...that.pinnedMessages[that.lastFetchFolder].messages));
        if (messages && messages[0] && messages[0].sentTime) {
          const folder = that.lastFetchFolder;
          const date_after = new Date(allMessages[0].sentTime).getTime();
          return this.authHttp.get(environment.baseUrl + '/api/mail/latest-messages', {
            params: {
              folder,
              date_after
            }
          })
            .map(response => {
              const latestMessages = response.json().data;
              if (latestMessages.length > 0) {
                that.messages[this.lastFetchFolder]['total_count'] = that.messages[this.lastFetchFolder]['total_count'] + latestMessages.length;
                that.fetchFolders();
                that.messages[that.lastFetchFolder]['messages'].unshift(...latestMessages);
                that.messages[that.lastFetchFolder]['messages'] =  this.sortByDate(that.messages[this.lastFetchFolder]['messages']);
              }
              return { messages: that.messages[that.lastFetchFolder]['messages'], count: that.messages[that.lastFetchFolder]['total_count'] };
            });
        }
      });
  }

  moveMessages(messages: MailMessage[], folderId: string) {
    const folder = this.findFolder(folderId);
    if (!folder) {
      console.error('Can`t find folder `${folder}` for add label to message');
      return Promise.resolve([]);
    }
    const ids = messages.map(msg => msg.id);

    return this.authHttp.post(environment.baseUrl + '/api/mail/move-messages/', {
      messages: ids,
      labels: folder.folder_id
    })
      .toPromise()
      .then((response: Response) => {
        const result = response.json();
        if (result.success === true) {
          this.fetchFolders();

          messages.forEach(message => {
            Object.keys(this.messages).forEach(k => {
              if (this.messages[k] && this.messages[k].messages.length) {
                const index = this.messages[k].messages.indexOf(message);
                if (index > -1) {
                  this.messages[k].messages.splice(index, 1);
                }
              }
            });
          });

          delete this.messages[folder.name];
          return Promise.resolve(this.messages[this.lastFetchFolder].messages);
        } else {
          console.error('Move messages to folder. Not success response from server.');
          return Promise.resolve([]);
        }
      })
      .catch((err) => {
        console.log(err);
        return Promise.resolve([]);
      })
  }

  deleteMessage(message: MailMessage) {
    return this.authHttp.delete(environment.baseUrl + '/api/messages/' + message.id, {})
      .toPromise()
      .then((response: Response) => {
        const result = response.json();
        if (result.success === true) {
          this.updateMessageCache(message, 'remove');
        }
        return Promise.resolve(this.messages[this.lastFetchFolder].messages);
      })
      .catch((err) => {
        console.log(err);
        return Promise.resolve([]);
      });
  }

  pinnedMessage(message: MailMessage): Promise<{messages: MailMessage[], count: number, pinnedMessages: MailMessage[], pin_count: number}> {
   return this.authHttp.put(environment.baseUrl + '/api/message/' + message.id + '/pinned', {pinned: !message.pinned})
     .toPromise()
     .then((response: Response) => {
       const result = response.json();
       if (result.success === true) {
         message.pinned = !message.pinned;
         if(message.pinned) {
           const index = this.messages[this.lastFetchFolder].messages.indexOf(message);
           this.pinnedMessages[this.lastFetchFolder].messages.push(message);
           this.pinnedMessages[this.lastFetchFolder]['total_count'] = this.pinnedMessages[this.lastFetchFolder]['total_count'] + 1;
           this.messages[this.lastFetchFolder].messages.splice(index, 1);
         } else {
           const index = this.pinnedMessages[this.lastFetchFolder].messages.indexOf(message);
           this.pinnedMessages[this.lastFetchFolder].messages.splice(index,1);
           this.pinnedMessages[this.lastFetchFolder]['total_count'] = this.pinnedMessages[this.lastFetchFolder]['total_count'] - 1;
           this.messages[this.lastFetchFolder].messages.push(message);
         }
         this.pinnedMessages[this.lastFetchFolder].messages = this.sortByDate(this.pinnedMessages[this.lastFetchFolder].messages);
         this.messages[this.lastFetchFolder].messages = this.sortByDate(this.messages[this.lastFetchFolder].messages);
       }
       return this._pinnedMessage();
     })
  }

  _pinnedMessage(): Promise<{messages: MailMessage[], count: number, pinnedMessages: MailMessage[], pin_count: number}> {
    let promises = [];
    Array.prototype.push.apply(promises, [
      this.getMoreMessages(this.lastFetchFolder, 'Date'),
      this.getMorePinnedMessages(this.lastFetchFolder, 'Date'),
    ]);
    return Promise.all(promises)
      .then((data: [Response]) => {
        return Promise.resolve({
          messages: data[0]['messages'],
          count: data[0]['count'],
          pinnedMessages: data[1]['pinnedMessages'],
          pin_count: data[1]['count']
        });
      })
      .catch((err) => {
        console.log(err);
        return Promise.resolve({messages : [], count:0, pinnedMessages: [], pin_count: 0});
      });
  }

  sortByDate(messages: MailMessage[]) {
    return messages.sort(function(firstMsg, nextMsg){
      return new Date(nextMsg.sentTime).getTime() - new Date(firstMsg.sentTime).getTime();
    })
  }
}
