import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MailService } from '../mail.service';
import { MailMessage } from '../mail-message';
import { MailTopic, MailTopicAnnotation } from '../mail-topic';

declare const $: any;

@Component({
  selector: 'app-topics-annotations',
  templateUrl: './topics-annotations.component.html',
  styleUrls: ['./topics-annotations.component.css']
})
export class TopicsAnnotationsComponent implements OnInit {

  @Input()
  set message(message: MailMessage) {
    this._message = message;
    if(this.initialized) {
      this.getAnnotations();
    }
  }
  get message(): MailMessage {
    return this._message;
  }
  private _message: MailMessage;
  private initialized: boolean = false;
  modal: BsModalRef;
  annotations: MailTopicAnnotation[] = [];
  shareText: boolean = true;
  newTopic: string;
  newTopics: string[] = [];

  status: string;
  statusError: string;

  constructor(private mailService: MailService) { }

  ngOnInit() {
    if(this.message) {
      this.getAnnotations();
    }
    this.initialized = true;
    this.makeResizableAndDraggable();
  }

  getAnnotations() {
    this.status = 'loadingAnnotations';
    this.annotations = [];
    this.mailService.getTopicsAnnotations(this.message.id)
      .subscribe(result => {
        this.status = null;
        this.shareText = result.shareText;
        this.annotations = this.message.topics.map(topic => {
          const annotationIndex = result.annotations.findIndex(annotation => topic.name === annotation.name);
          if (annotationIndex === -1) {
            return {name: topic.name} as MailTopicAnnotation;
          }

          return {
            name: topic.name,
            rating: result.annotations.splice(annotationIndex, 1)[0].rating
          } as MailTopicAnnotation;
        })

        this.annotations = this.annotations.concat(result.annotations);
      });
  }

  addTopic() {
    if (this.newTopic) {
      this.newTopics.push(this.newTopic);
      this.newTopic = '';
    }
  }

  removeTopic(topic: string) {
    console.log("removing topic", topic);
    this.newTopics = this.newTopics.filter(listTopic => listTopic !== topic);
  }

  save() {
    this.status = 'saving';
    this.statusError = '';

    this.addTopic();

    Observable.zip(
      this.mailService.saveTopicsAnnotations(
        this.message.id,
        this.annotations
          .filter(annotation => !!annotation.rating)
          .concat(this.newTopics.map(topic => {return {name: topic, rating: 'good'} as MailTopicAnnotation})),
        this.shareText
      ),
      this.mailService.updateTopics(
        this.message.id,
        this.newTopics.map(topic => {return {name: topic} as MailTopic})
      )
    ).subscribe(
      ([annotationsRes, topicsRes]) => {
        if (annotationsRes && topicsRes && this.modal) {
          this.modal.hide();
        }
        else {
          this.status = (annotationsRes && topicsRes)?'saved':'error';
        }
      },
      err => {
        this.status = 'error';
        this.statusError = 'Unexpected error while saving data. Please try again.';
      }
    );
  }

  close() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  makeResizableAndDraggable() {
    $('.modal-content')
      .draggable({
        handle: '.modal-header'
      })
      .resizable()
      .css({
        left: 'calc(50% - 300px)',
        top: '60px',
        width: '600px'
      });
  }

}
