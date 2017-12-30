import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mail-pagination',
  templateUrl: './mail-pagination.component.html',
  styleUrls: ['./mail-pagination.component.css']
})
export class MailPaginationComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  @Input() page: number;
  @Input() count: number;
  @Input() perPage: number;
  @Input() loading: boolean;

  @Output() goPrevious = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();


  getMin(): number {
    return ((this.perPage * this.page) - this.perPage) + 1;
  }

  getMax(): number {
    let max = this.perPage * this.page;
    if (max > this.count) {
      max = this.count;
    }
    return max;
  }

  onPrevious(): void {
    this.goPrevious.emit(true);
  }

  onNext(): void {
    this.goNext.emit(true);
  }

  lastPage(): boolean {
    return this.perPage * this.page >= this.count;
  }
}
