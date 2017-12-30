import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

import { File } from './file';
import { MailMessage, Recipient } from './mail-message';
import { KnowledgeGraphRelatedInfo } from './knowledge-graph-related-info';

import { environment } from '../../environments/environment';

class KnowledgeInfoFilters {
  messageId?: string;
  contact?: Recipient;
  topic?: string;
  relatedTopic?: string;
  relatedContact?: Recipient;
  mailOrder?: string;
  ignoreContact?: Recipient;
}

class KnowledgeInfoLimits {
  topics?: number;
  connections?: number;
  messages?: number;
  images?: number;
  documents?: number;
  videos?: number;
}

@Injectable()
export class KnowledgeGraphService {

  constructor(private authHttp: AuthHttp) { }

  private formatFilters(filters: KnowledgeInfoFilters, limit?: number, offset?: number, knowledgeInfoLimit?: KnowledgeInfoLimits): object {
    let params = {};
    if(filters.messageId) params['message_id'] = filters.messageId;
    if(filters.topic) params['topic'] = filters.topic;
    if(filters.relatedTopic) params['related_topic'] = filters.relatedTopic;
    if(filters.contact) {
      params['contact_name'] = filters.contact.name;
      params['contact_email'] = filters.contact.email;
    }
    if(filters.relatedContact) {
      params['related_contact_name'] = filters.relatedContact.name;
      params['related_contact_email'] = filters.relatedContact.email;
    }
    if(filters.ignoreContact) {
      params['ignore_contact_name'] = filters.ignoreContact.name;
      params['ignore_contact_email'] = filters.ignoreContact.email;
    }
    if(limit) params['limit'] = limit;
    if(offset) params['offset'] = offset;
    if(filters.mailOrder) params['mail_order'] = filters.mailOrder.toLowerCase();

    if (knowledgeInfoLimit) {
      if (knowledgeInfoLimit.topics) { params['topics_limit'] = knowledgeInfoLimit.topics; }
      if (knowledgeInfoLimit.connections) { params['connections_limit'] = knowledgeInfoLimit.connections; }
      if (knowledgeInfoLimit.messages) { params['messages_limit'] = knowledgeInfoLimit.messages; }
      if (knowledgeInfoLimit.images) { params['images_limit'] = knowledgeInfoLimit.images; }
      if (knowledgeInfoLimit.documents) { params['documents_limit'] = knowledgeInfoLimit.documents; }
      if (knowledgeInfoLimit.videos) { params['videos_limit'] = knowledgeInfoLimit.videos; }
    }

    return params;
  }

  getRelatedInfo(filters: KnowledgeInfoFilters, limits?: KnowledgeInfoLimits): Observable<KnowledgeGraphRelatedInfo> {
    return this.authHttp.get(environment.baseUrl+"/api/knowledge-graph", { params: this.formatFilters(filters, undefined, undefined, limits) })
      .map(response => response.json().data as KnowledgeGraphRelatedInfo);
  }

  getRelatedTopics(filters: KnowledgeInfoFilters, limit: number, offset: number): Observable<{data: string[], count: number}> {
    return this.authHttp.get(environment.baseUrl+"/api/knowledge-graph/topics", { params: this.formatFilters(filters, limit, offset) })
      .map(response => response.json().data as {data: string[], count: number});
  }

  getRelatedConnections(filters: KnowledgeInfoFilters, limit: number, offset: number): Observable<{data: Recipient[], count: number}> {
    return this.authHttp.get(environment.baseUrl+"/api/knowledge-graph/connections", { params: this.formatFilters(filters, limit, offset) })
      .map(response => response.json().data as {data: Recipient[], count: number});
  }

  getRelatedMessages(filters: KnowledgeInfoFilters, limit: number, offset: number): Observable<{data: MailMessage[], count: number}> {
    return this.authHttp.get(environment.baseUrl+"/api/knowledge-graph/messages", { params: this.formatFilters(filters, limit, offset) })
      .map(response => response.json().data as {data: MailMessage[], count: number});
  }

  getRelatedFiles(type: string, filters: KnowledgeInfoFilters, limit: number, offset: number): Observable<{data: File[], count: number}> {
    return this.authHttp.get(environment.baseUrl+"/api/knowledge-graph/files/" + type, { params: this.formatFilters(filters, limit, offset) })
      .map(response => response.json().data as {data: File[], count: number});
  }
}
