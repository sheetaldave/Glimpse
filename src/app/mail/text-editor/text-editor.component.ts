import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { Editor } from 'tinymce';

@Component({
  selector: 'text-editor',
  template: `<textarea id="{{elementId}}"></textarea>`
})
export class TextEditorComponent implements AfterViewInit, OnDestroy, OnInit {
  elementId: string;
  private _messageBody: string = '';

  @Input()
  set messageBody(txt) {
    if (this._messageBody !== txt) {
      this._messageBody = txt || '';
      this.fillBody(this._messageBody);
    }
  }

  get messageBody() {
    return this._messageBody;
  }

  @Output() onEditorKeyup = new EventEmitter<any>();
  editor: Editor;

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'autoresize'],
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link pastetext',
      skin_url: '../assets/skins/lightgray',
      menu: {},
      resize: false,
      statusbar: false,
      width: '100%',
      elementpath: false,
      min_width: 686,
      min_height: 165,
      init_instance_callback: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          this._messageBody = editor.getContent();
          this.onEditorKeyup.emit(this._messageBody);
        });
        this.fillBody(this._messageBody);
      },
    });
    this.fillBody(this._messageBody);
  }

  ngOnInit(): void{
    this.elementId  = 'editor_'+ Math.floor(Math.random() * 9999)
  }

  fillBody(body): void {
    if (this.editor) {
      this.editor.setContent(body)
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
