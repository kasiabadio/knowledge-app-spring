import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';
import { KnowledgeService } from './services/knowledge.service';

@NgModule({
  declarations: [
    AppComponent,
    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent
    ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [KnowledgeService],
  bootstrap: [AppComponent]
})
export class KnowledgeModuleModule { }
