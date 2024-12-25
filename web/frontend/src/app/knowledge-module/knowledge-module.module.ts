import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';
import { KnowledgeService } from '../services/knowledge.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,

    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    KnowledgeDetailComponent,
    KnowledgeListComponent,
    KnowledgeFormComponent
    ],
  providers: [KnowledgeService],
  bootstrap: []
})
export class KnowledgeModuleModule { }
