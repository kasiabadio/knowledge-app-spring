import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { KnowledgeModule } from './knowledge-module/knowledge-module.module';
import { CategoryModule } from './category-module/category-module.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    KnowledgeModule,
    CategoryModule,
    ReactiveFormsModule
  ],
  providers: [HttpClientModule.withFetch()],
  bootstrap: [AppComponent]
})
export class AppModule { }
