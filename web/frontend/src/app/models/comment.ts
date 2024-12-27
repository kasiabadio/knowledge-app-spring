import { User } from './user';
import { Knowledge } from './knowledge';

export interface Comment {
    groupId: number,
    user: User,
    knowledge: Knowledge,
    content: string,
    createdDate: Date,
    lastModifiedDate: Date
  }
