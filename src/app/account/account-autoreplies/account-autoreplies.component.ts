import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Editor } from 'tinymce';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-autoreplies',
  templateUrl: './account-autoreplies.component.html',
  styleUrls: ['./account-autoreplies.component.css']
})
export class AccountAutorepliesComponent implements OnInit, AfterViewInit {

  public fromDateTime: Date;
  public tillDateTime: Date;
  elementId: string;
  editor: Editor;
  errorMessage: string;
  success: boolean = false;
  loading: boolean = false;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.elementId = 'autoreply_' + Math.floor(Math.random() * 9999);
    this.loading = false;
    this.errorMessage = '';
    this.accountService.getAutoReply()
      .subscribe(
        data => {
          if (data && data.dateFrom) {
            this.fromDateTime = new Date(data.dateFrom);
          }
          if (data && data.dateTo) {
            this.tillDateTime = new Date(data.dateTo);
          }
          if (this.editor && data) {
            this.editor.setContent(data.content || '');
          }
        },
        error => this.errorMessage = error
      );
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste' ],
      height: 150,
      resize: 'vertical',
      skin_url: '../assets/skins/lightgray',
      menu: {},
      init_instance_callback: editor => {
        this.editor = editor;
      }
    });
  }

  saveAutoReply() {
    this.loading = true;
    this.errorMessage = this.validate();

    if (this.errorMessage.length > 0) {
      this.loading = false;
      return;
    }

    const autoReply = {
      dateFrom: this.fromDateTime.getTime(),
      dateTo: this.tillDateTime.getTime(),
      content: this.editor.getContent()
    };

    this.accountService.saveAutoReply(autoReply)
      .subscribe(
        response => {
            this.loading = false;
            this.success = true;
        },
        error => {
          this.loading = false;
          console.error(error);
        }
      );
  }

  validate(): string {
    const today = new Date();

    if (!this.fromDateTime) {
      return 'Choose from which date autoreply period should start';
    }

    if (!this.tillDateTime) {
      return 'Choose when autoreply period should end';
    }

    if (this.editor && !this.editor.getContent().length) {
      return 'Autoreply message can not be empty';
    }

    if (this.tillDateTime.getTime() < today.getTime()) {
      return 'End of the period can not be earlier than now';
    }

    if (this.tillDateTime.getTime() < this.fromDateTime.getTime()) {
      return 'Can not set end of the period earlier than then its own start';
    }

    return '';
  }
}
