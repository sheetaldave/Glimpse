import { File } from './file';
import { MailMessage, Recipient } from './mail-message';

export class KnowledgeGraphRelatedInfo {
  topics: {
    count: number;
    data: string[];
  };
  connections: {
    count: number;
    data: Recipient[];
  };
  messages: {
    count: number;
    data: MailMessage[];
  };
  files: {
    images: {
      count: number;
      data: File[];
    };
    videos: {
      count: number;
      data: File[];
    };
    documents: {
      count: number;
      data: File[];
    };
    allTypes: {
      count: number,
      data: File[]
    }
  };
}
