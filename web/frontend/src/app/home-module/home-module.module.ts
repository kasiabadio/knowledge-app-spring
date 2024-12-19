import { NgModule } from '@angular/core';
import { HomeDetailComponent } from './home-detail/home-detail.component';
import { KnowledgeService } from '../services/knowledge.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [

    ],
  imports: [
    CommonModule,
    HttpClientModule,
    HomeDetailComponent
    ],
  exports: [
    HomeDetailComponent
    ],
  providers: [KnowledgeService],
  bootstrap: []
  })
export class HomeModuleModule { }
