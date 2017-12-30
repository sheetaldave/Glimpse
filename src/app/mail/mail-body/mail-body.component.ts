import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

declare var caja: any;

@Component({
  selector: 'app-mail-body',
  templateUrl: './mail-body.component.html',
  styleUrls: ['./mail-body.component.css']
})
export class MailBodyComponent implements OnInit, AfterViewInit {

  private _body: string;
  private _cajaFrame: any;
  uniqueBodyID: string;

  @Input()
  set body(body: string) {
    this._body = body.replace(/\n/g, ' ');
    if (this.uniqueBodyID) {
      this._displayBody();
    }
  }

  get body(): string { return this._body; }

  constructor() { }

  ngOnInit() {
    this.uniqueBodyID = 'mail-body' + Math.random();

    if (caja.state === 'UNREADY') {
      caja.initialize({
        cajaServer: 'https://glimpse.deepframe.io/assets/caja/',
        debug: true
      });
    }
  }

  ngAfterViewInit() {
    if (this._body) {
      this._displayBody();
    }
  }

  private _displayBody() {
    if (this._cajaFrame) {
      this._cajaFrame.code('', 'text/html', this._body)
        .run();
    } else {
      caja.load(document.getElementById(this.uniqueBodyID), {
        'rewrite': uri => String(uri),
        'fetch': (url, mime, callback) => {
          setTimeout(() => callback({}), 0);
        }
      }, frame => {
        this._cajaFrame = frame;
        this._cajaFrame.code('', 'text/html', this._body)
          .run();
      });
    }
  }
}
