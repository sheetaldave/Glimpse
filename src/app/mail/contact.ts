/**
 * Created by lenovo on 7/12/2017.
 */
import {MailMessage} from "./mail-message";
import {File} from "./file";
export class Contact {
  messages : MailMessage[];
  files: {
    images: File[],
    videos: File[],
    docs: File[],
  };
  events : object[];
  topics: object[];
  connections : object[];
  name: string;
  address: string;
  mobile: string;
  email : string;
  profileUrl: string;
  totals: object;
}

