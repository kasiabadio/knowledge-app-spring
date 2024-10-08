import { CategoryKnowledgeGroup } from './categoryknowledgegroup';

export interface Knowledge {
    idKnowledge: number,
    title: string,
    content: string,
    createdDate: Date,
    lastModifiedDate: Date,
    author: string,
    knowledgeCategories: any[]
  }
