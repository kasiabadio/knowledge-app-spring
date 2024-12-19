import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { KnowledgeModuleModule } from './knowledge-module/knowledge-module.module';
import { CategoryModuleModule } from './category-module/category-module.module';
import { AdminModuleModule } from './admin-module/admin-module.module';
import { HomeModuleModule } from './home-module/home-module.module';

import { NavbarDetailComponent } from './navbar-detail.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    KnowledgeModuleModule,
    CategoryModuleModule,
    AdminModuleModule,
    HomeModuleModule,
    NavbarDetailComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
