import { NgModule } from '@angular/core';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [

    ],
  imports: [
    CommonModule,
    HttpClientModule,
    CategoryDetailComponent,
    CategoryListComponent,
    ],
  exports: [
    CategoryDetailComponent,
    CategoryListComponent,
    ],
  providers: [CategoryService],
  bootstrap: []
  })
export class CategoryModuleModule { }
