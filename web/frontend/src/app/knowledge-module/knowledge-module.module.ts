import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';
import { KnowledgeService } from '../services/knowledge.service';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,

    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent,

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
