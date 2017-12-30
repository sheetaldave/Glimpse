import { Component, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '../../file';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-attachment-preview-modal',
  templateUrl: './attachment-preview-modal.component.html',
  styleUrls: ['./attachment-preview-modal.component.css']
})
export class AttachmentPreviewModalComponent extends BaseModalComponent {

  contentType: string;

  private _file: File;
  @Input()
  set file(file: File) {
    if (this._file !== file) {
      this._file = file;
      if (file) {
        if (file.type.match(/^image\//)) {
          this.contentType = 'image';
        } else if (file.type.match(/^video\//)) {
          this.contentType = 'video';
        } else if (file.type.match('application/pdf')) {
          this.contentType = 'pdf';
        } else {
          this.contentType = '';
        }
      }
    }
  }
  get file() {
    return this._file;
  }

  constructor(protected element: ElementRef, protected router: Router) {
    super(element, router);
  }

}
