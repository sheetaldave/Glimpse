import { MailTopic } from './mail-topic';
import { MailFolder } from "./mail-folder";

export class MailMessage {
  id: string;
  subject: string;
  snippet: string;
  body: string;
  from: Recipient;
  to: Recipient[];
  cc: Recipient[];
  bcc: Recipient[];
  participants: Recipient[];
  sentTime: Date;
  unread: boolean;
  starred: boolean;
  files: File[];
  thread: string;
  pinned: boolean;
  topics: MailTopic[];
  labels : MailFolder[];
  forwarded: boolean;
  replied: boolean
}
export class Recipient  {
  email: string;
  name: string;
}
