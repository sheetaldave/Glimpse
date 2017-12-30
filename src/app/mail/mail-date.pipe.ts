import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'mailDate'
})
export class MailDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: any, args = true): string {
    const currentDate = new Date();
    const messageDate = new Date(value);

    if (messageDate.getUTCFullYear() === currentDate.getUTCFullYear()
      && messageDate.getUTCMonth() === currentDate.getUTCMonth()
      && messageDate.getUTCDate() === currentDate.getUTCDate() - 1
      && args === true) {

      return 'Yesterday at ' + this.datePipe.transform(messageDate, 'h:mm a');
    } else if (messageDate.getUTCFullYear() === currentDate.getUTCFullYear()
      && messageDate.getUTCMonth() === currentDate.getUTCMonth()
      && messageDate.getUTCDate() === currentDate.getUTCDate()
      && args === true) {

      return 'Today at ' + this.datePipe.transform(messageDate, 'h:mm a');
    } else {
      return this.datePipe.transform(messageDate, 'MMM, d, y h:mm a');
    }
  }
}
