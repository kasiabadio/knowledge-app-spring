import { Knowledge } from './knowledge';
import { Category } from './category';

export interface CategoryKnowledgeKey {
  idCategory: number;
  idKnowledge: number;
}

export interface CategoryKnowledgeGroup {
  groupId: CategoryKnowledgeKey;
  category: Category;
  knowledge: Knowledge;
}
