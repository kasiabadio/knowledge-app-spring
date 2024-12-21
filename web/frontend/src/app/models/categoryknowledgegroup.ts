import { Knowledge } from './knowledge';
import { Category } from './category';


export interface CategoryKnowledgeGroup {
  groupId: number;
  category: Category;
  knowledge: Knowledge;
}
