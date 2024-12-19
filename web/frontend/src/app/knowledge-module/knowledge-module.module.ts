import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';
import { KnowledgeService } from '../services/knowledge.service';

@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent
  ],
  exports: [
    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent
    ],
  providers: [KnowledgeService],
  bootstrap: []
})
export class KnowledgeModuleModule { }
