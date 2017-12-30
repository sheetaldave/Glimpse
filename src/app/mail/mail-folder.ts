export class MailFolder {
  folder_id : string;
  name: string;
  totalMails: number;
  unreadMails: number;
  icon: string;
  sub_folders?:MailFolder[];
  id: string;
}
