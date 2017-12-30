import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Editor } from 'tinymce';

import { AccountService } from '../account.service';

import { AccountQuickReplyTemplates } from '../account-quick-reply-templates';

@Component({
  selector: 'app-account-quick-reply-templates',
  templateUrl: './account-quick-reply-templates.component.html',
  styleUrls: ['./account-quick-reply-templates.component.css']
})
export class AccountQuickReplyTemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  editorId: string;
  titleInputValue: string;
  editor: Editor;
  loading: boolean;
  saved: boolean;
  errorMessage: string;
  showForm: boolean;
  quickReplyTemplates: AccountQuickReplyTemplates[];
  replyTemplateId: string;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.editorId = 'editor_reply_templates';
    this.titleInputValue = '';
    this.loading = false;
    this.saved = false;
    this.errorMessage = '';
    this.showForm = false;
    this.quickReplyTemplates = [];
    this.replyTemplateId = '';

    this.accountService.getQuickReplyTemplates()
      .subscribe(
        response => {
          this.quickReplyTemplates = response;
        },
        error => this.errorMessage = error
      );
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.editorId,
      plugins: ['link', 'paste' ],
      height: 250,
      skin_url: '../assets/skins/lightgray',
      menu: {},
      init_instance_callback: editor => {
        this.editor = editor;
      },
    });
  }

  openForm(replyTemplate?) {
    this.closeForm();

    if (replyTemplate) {
      this.replyTemplateId = replyTemplate.id;

      // set title input
      this.editor.setContent(replyTemplate.content);
      this.titleInputValue = replyTemplate.title;
    }

    this.showForm = true;

    window.scrollTo(0, 0);
  }

  closeForm() {
    this.showForm = false;
    this.editor.setContent('');
    this.titleInputValue = '';
    this.replyTemplateId = '';
  }

  _onSuccess(result: any) {
    this.loading = false;
    this.saved = result['success'];
    if (!result['success']) {
      this.errorMessage = result['error'];
    }

    this.accountService.getQuickReplyTemplates()
      .subscribe(
        response => {
          this.quickReplyTemplates = response;
        },
        error => this.errorMessage = error
      );

    this.closeForm();
  }

  _onError(error: any) {
    this.loading = false;
    this.saved = false;
    this.errorMessage = error;

    this.closeForm();
  }

  saveTemplate() {
    this.loading = true;
    this.saved = false;
    this.errorMessage = '';


    if (this.replyTemplateId) {
      this.accountService.updateQuickReplyTemplate(this.replyTemplateId, this.titleInputValue, this.editor.getContent())
        .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
    } else {
      this.accountService.createQuickReplyTemplate(this.titleInputValue, this.editor.getContent())
        .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
    }
  }

  deleteTemplate(id) {
    this.loading = true;
    this.saved = false;
    this.errorMessage = '';
    this.accountService.removeQuickReplyTemplate(id)
      .subscribe(this._onSuccess.bind(this), this._onError.bind(this));
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}
