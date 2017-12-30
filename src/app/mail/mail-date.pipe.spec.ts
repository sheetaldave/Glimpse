import { MailDatePipe } from './mail-date.pipe';

describe('MailDatePipe', () => {
  it('create an instance', () => {
    const pipe = new MailDatePipe();
    expect(pipe).toBeTruthy();
  });
});
