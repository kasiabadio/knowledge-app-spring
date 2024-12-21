import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule ],
  providers: [ CategoryService ],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isVisible: boolean = false;

  constructor(private service: CategoryService, private router: Router){}

  ngOnInit(){
    this.loadCategories();
   }

  loadCategories(){
    this.service.getCategories().subscribe({
        next: (data: Category[]) => {
            this.categories = data;
          },
        error: err => console.log(err)
        })
    }

  backToKnowledge(){
    this.router.navigate(['knowledge']);
    }


  selectCategoryKnowledge(){
    this.isVisible = !this.isVisible;
    }
}
