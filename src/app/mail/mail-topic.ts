export class MailTopic {
  name: string;
  offsets: [{
      start: number,
      end: number
  }];
}

export class MailTopicAnnotation {
  name: string;
  rating: string;
}
