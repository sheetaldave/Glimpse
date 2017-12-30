import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Editor } from 'tinymce';

import { AccountService } from '../account.service';
import { AccountSignature } from '../account-signature';

@Component({
  selector: 'app-account-signature',
  templateUrl: './account-signature.component.html',
  styleUrls: ['./account-signature.component.css']
})
export class AccountSignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  elementId: String;
  editor: Editor;
  state: string;
  loadingSignatures: boolean;
  errorMessage: string;
  selectedSignature: AccountSignature = { title: '', content: '' } as AccountSignature;
  showForm: boolean;
  signatures: AccountSignature[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.elementId  = 'editor_'+ Math.floor(Math.random() * 9999);
    this.errorMessage = '';
    this.getSignatures();
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste' ],
      height: 100,
      resize:false,
      skin_url: '../assets/skins/lightgray',
      menu: {},
      init_instance_callback: editor => {
        this.editor = editor;
      }
    });
  }

  getSignatures() {
    this.loadingSignatures = true;
    this.accountService.getSignatures(true)
      .subscribe(
        signatures => {
          this.loadingSignatures = false;
          this.signatures = signatures;
        },
        error => {
          this.loadingSignatures = false;
          this.state = 'error';
          this.errorMessage = error;
        }
      )
  }

  saveSignature() {
    this.errorMessage = '';
    this.selectedSignature.content = this.editor.getContent();

    if (!this.selectedSignature.title || this.selectedSignature.title === '' ||
        !this.selectedSignature.content || this.selectedSignature.content === '') {
      this.errorMessage = 'Signature title and content are required';
      this.state = 'error';
      return;
    }

    this.state = 'processing';
    this.accountService.saveSignature(this.selectedSignature)
      .subscribe(
        result => {
          if (!result['success']) {
            this.errorMessage = result['error'];
            this.state = 'error';
            return;
          }
          this.state = 'saved';
          this.closeForm();
          this.getSignatures();
        },
        error => {
          this.state = 'error';
          this.errorMessage = error
        }
      )
  }

  removeSignature(signature: AccountSignature) {
    this.state = 'processing';
    this.closeForm();
    this.accountService.removeSignature(signature.id)
      .subscribe(
        response => {
          this.state = 'deleted';
          this.getSignatures();
        },
        error => console.error(error)
      );
  }

  openForm(signature?: AccountSignature) {
    this.closeForm();
    this.state = null;
    if (signature && this.editor) {
      this.selectedSignature = signature;
      this.editor.setContent(signature.content);
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.resetSignature();
  }

  setDefault(signature: AccountSignature): void {
    this.closeForm();
    this.state = 'processing';
    this.accountService.saveSignature(signature, true)
      .subscribe(
        result => {
          this.state = 'defaultSet';
          this.getSignatures();
        },
        error => {
          this.state = 'error';
          this.errorMessage = error;
        }
      )
  }

  resetSignature() {
    if (this.editor) {
      this.editor.setContent('');
    }
    this.selectedSignature = { title: '', content: '' } as AccountSignature;
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
