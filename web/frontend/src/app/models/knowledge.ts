import { User } from './user';

export interface Knowledge {
    idKnowledge: number,
    title: string,
    content: string,
    createdDate: Date,
    lastModifiedDate: Date,
    user: User,
    isPublicKnowledge: boolean,
    categories: any[]
    comments: any[]
  }
