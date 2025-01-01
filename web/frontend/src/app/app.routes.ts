import { Routes } from '@angular/router';

import { KnowledgeFormComponent } from './knowledge-module/knowledge-form/knowledge-form.component';
import { KnowledgeDetailComponent } from './knowledge-module/knowledge-detail/knowledge-detail.component';
import { KnowledgeListComponent } from './knowledge-module/knowledge-list/knowledge-list.component';
import { CategoryListComponent } from './category-module/category-list/category-list.component';
import { RegisterComponent } from './login-module/register/register.component';
import { LoginComponent } from './login-module/login/login.component';
import { ActivateAccountComponent } from './login-module/activate-account/activate-account.component';
import { PasswordResetComponent } from './login-module/password-reset/password-reset.component';
import { HomeDetailComponent } from './home-module/home-detail/home-detail.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdminDetailComponent } from './admin-module/admin-detail/admin-detail.component';
import { UserDetailComponent } from './user-module/user-detail/user-detail.component';

export const routes: Routes = [

    // Routes with Navbar
    {
      path: '',
      component: MainLayoutComponent,
      children: [
         { path: 'home', component: HomeDetailComponent },
          { path: 'admin-panel', component: AdminDetailComponent },
          { path: 'user-panel', component: UserDetailComponent },
          { path: 'knowledge/form', component: KnowledgeFormComponent },
          { path: 'knowledge', component: KnowledgeListComponent },
          { path: 'knowledge/detail/:id', component: KnowledgeDetailComponent },
          { path: 'knowledge/categories', component: CategoryListComponent },
      ],
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'activate-account', component: ActivateAccountComponent },

    { path: '**', redirectTo: 'main' },

  ];
