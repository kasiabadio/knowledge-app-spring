import { Routes } from '@angular/router';
import { KnowledgeFormComponent } from './knowledge-module/knowledge-form/knowledge-form.component';
import { KnowledgeDetailComponent } from './knowledge-module/knowledge-detail/knowledge-detail.component';
import { KnowledgeListComponent } from './knowledge-module/knowledge-list/knowledge-list.component';
import { CategoryListComponent } from './category-module/category-list/category-list.component';

export const routes: Routes = [
  { path: 'form', component: KnowledgeFormComponent },
  { path: '', component: KnowledgeListComponent },
  { path: 'detail/:id', component: KnowledgeDetailComponent },
  { path: 'detail/edit/:id', component: KnowledgeDetailComponent },
  { path: 'categories', component: CategoryListComponent }
  ];
