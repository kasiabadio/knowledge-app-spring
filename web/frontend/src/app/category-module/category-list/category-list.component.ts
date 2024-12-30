import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Category } from '../../models/category';
import { CategoryDto } from '../../models/category-dto';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../token/token.service';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [ NgIf, NgFor, CommonModule, FormsModule, ReactiveFormsModule ],
  providers: [ CategoryService ],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isVisible: boolean = false;
  categoryForm: any;
  canDelete: boolean = false;


  constructor(
    private cd: ChangeDetectorRef,
    private serviceCategory: CategoryService,
    private serviceToken: TokenService,
    private router: Router
    ){}

  ngOnInit(){
    this.loadCategories();
    this.updatePermissions();
    this.categoryForm = new FormGroup({
      categoryName: new FormControl('', [Validators.required])
      });
   }


 updatePermissions() {
     if (
       this.serviceToken?.currentUser?.authorities?.includes('ADMIN')
     ) {
       this.canDelete = true;
     }
   }


  loadCategories(){
    this.serviceCategory.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cd.detectChanges();
        },
      error: (err) => console.error(err),
      });
    }



   deleteCategory(categoryName: string){
     this.serviceCategory.deleteCategory(categoryName).subscribe({
       next: () => {
         this.loadCategories();
         this.cd.detectChanges();
         },
       error: (err) => console.error(err)
       })
     }

   createCategory(){
     if (this.categoryForm.valid){
     const category: CategoryDto = {
       categoryName: this.categoryForm.get("categoryName")?.value,
       }

      this.serviceCategory.createCategory(category).subscribe({
        next: () => {
          this.loadCategories();
          this.categoryForm.get("categoryName").reset();
          this.cd.detectChanges();
          },
        error: (err) => console.error(err),
        });

     } else {
       console.log("Form is invalid");
       }

   }

}
