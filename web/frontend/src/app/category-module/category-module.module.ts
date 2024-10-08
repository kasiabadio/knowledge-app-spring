import { NgModule } from '@angular/core';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryService } from './services/category.service';

@NgModule({
  declarations: [
    AppComponent,
    CategoryDetailComponent,
    CategoryListComponent
    ],
  imports: [
    CommonModule,
    HttpClientModule
    ],
  providers: [CategoryService],
  bootstrap: [AppComponent]
  })
export class CategoryModuleModule { }
