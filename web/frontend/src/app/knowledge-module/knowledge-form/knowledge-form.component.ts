import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KnowledgeService } from '../../services/knowledge.service';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-knowledge-form',
  standalone: true,
  imports: [ FormsModule, NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatSelectModule ],
  templateUrl: './knowledge-form.component.html',
  styleUrls: ['./knowledge-form.component.css'],
})
export class KnowledgeFormComponent implements OnInit {
    knowledgeForm: any;
    validatorString: string;
    currentUser: any;
    categories: Category[] = [];
    selectedCategories: string[] = [];


    constructor(private serviceKnowledge: KnowledgeService,
      private fb: FormBuilder,
      private router: Router,
      private tokenService: TokenService,
      private userService: UserService,
      private categoryService: CategoryService) {
        this.validatorString = '^[a-zA-Z,.!?\\s-]+$';
    }

    ngOnInit(): void {
        this.knowledgeForm = this.fb.group({
        title: ['', [Validators.required, Validators.pattern(this.validatorString)]],
        content: ['', [Validators.required]],
        userId: [null, Validators.required],
        isPublicKnowledge: [true]
        });

         this.currentUser = this.tokenService.currentUser;
           if (this.currentUser) {
               this.userService.getUserIdByEmail(this.currentUser.email).subscribe({
                 next: (id) => {
                   this.knowledgeForm.patchValue({ userId: id });
                   }
                 })
           } else {
              console.warn('No current user found.');
           }

         this.categoryService.getCategories().subscribe({
             next: (categories) => {
                 this.categories = categories;
             },
             error: (err) => {
                 console.error("Error fetching categories:", err);
             }
         });

      }

    onSubmit(): void {

      if (this.knowledgeForm.valid){
        console.table(this.knowledgeForm.value);
          this.serviceKnowledge.createKnowledge(this.knowledgeForm.value, this.selectedCategories).subscribe({
            next: ()=>{
              this.router.navigate(['knowledge']);
              },
            error: err=>console.log(err)
            });
        } else {
          console.log("Not correct form");
          console.log('Form Status:', this.knowledgeForm.status);
          console.log('Form Errors:', this.knowledgeForm.errors);
          console.log('Form Values:', this.knowledgeForm.value);
          }
      }

    numberValidator(control: any) {
        const value = control.value;
        if (value === null || value === undefined || isNaN(value)) {
          return { invalidNumber: true };
        }
        return null;
      }


    backToKnowledge(){
        this.router.navigate(['knowledge']);
    }

}
