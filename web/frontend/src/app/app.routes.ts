import { Routes } from '@angular/router';
import { KnowledgeFormComponent } from './knowledge-module/knowledge-form/knowledge-form.component';
import { KnowledgeDetailComponent } from './knowledge-module/knowledge-detail/knowledge-detail.component';
import { KnowledgeListComponent } from './knowledge-module/knowledge-list/knowledge-list.component';
import { CategoryListComponent } from './category-module/category-list/category-list.component';
import { RegisterComponent } from './login-module/register/register.component';
import { LoginComponent } from './login-module/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'knowledge/form', component: KnowledgeFormComponent },
  { path: 'knowledge/', component: KnowledgeListComponent },
  { path: 'knowledge/detail/:id', component: KnowledgeDetailComponent },
  { path: 'knowledge/detail/edit/:id', component: KnowledgeDetailComponent },
  { path: 'knowledge/categories', component: CategoryListComponent }
  ];
