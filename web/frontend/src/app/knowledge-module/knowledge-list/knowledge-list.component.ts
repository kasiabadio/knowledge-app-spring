import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Knowledge } from '../../models/knowledge';
import { Category } from '../../models/category';
import { UserDto } from '../../models/user-dto';

import { KnowledgeService } from '../../services/knowledge.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { CategoryKnowledgeGroupService } from '../../services/categoryknowledgegroup.service';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../token/token.service';

import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";


@Component({
  selector: 'app-knowledge-list',
  templateUrl: './knowledge-list.component.html',
  styleUrls: ['./knowledge-list.component.css'],
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule
    ],
  providers: [ KnowledgeService ]
})

export class KnowledgeListComponent implements OnInit {
  knowledge: Knowledge[] = [];
  selectedKnowledge: Knowledge | undefined;
  token: string = '';
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  authors: UserDto[] = [];
  selectedAuthors: UserDto[] = [];

  constructor(private service: KnowledgeService,
    private categoryService: CategoryService,
    private categoryKnowledgeGroupService: CategoryKnowledgeGroupService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
    ){}

  ngOnInit(){
        this.token = this.tokenService.token;
        this.loadCategories();
        this.loadKnowledgeFromAuthors();
        this.loadKnowledge();
        }

  loadKnowledge() {
    this.service.getKnowledge().subscribe({
      next: (data: any[]) => {
        this.knowledge = data;
      },
      error: (err) => {
        console.error('Error while fetching Knowledge: ', err);
        if (err.status) {
          console.error(`HTTP Status: ${err.status}`);
        }
        if (err.error) {
          console.error('Backend Error Response:', err.error);
        }
        if (err.message) {
          console.error('Error Message:', err.message);
        }
      },
      complete: () => {
        console.log('Knowledge fetching completed.');
      },
    });
  }

  loadCategories(){
      this.categoryService.getCategories().subscribe({
        next: (data: any[]) => {
          this.categories = data;
          },
        error: (err) => {
            console.error("Error fetching Categories: ", err);
            if (err.status) {
              console.error(`HTTP Status: ${err.status}`);
            }
            if (err.error) {
              console.error('Backend Error Response:', err.error);
            }
            if (err.message) {
              console.error('Error Message:', err.message);
            }
          }
        })
    }

  loadKnowledgeFromCategories(){
    this.knowledge = []
    for (let i = 0; i < this.selectedCategories.length; i++){
      this.categoryKnowledgeGroupService.getAllKnowledgesFromCategory(this.selectedCategories[i].categoryName).subscribe({
        next: (data: Knowledge[]) => {
           this.knowledge = this.removeDuplicates([...this.knowledge, ...data]);
          },
        error: (err) => {
               console.error("Error fetching Knowledge by category: ", err);
          }
        })
      }
    }

    loadKnowledgeFromAuthors() {
      this.knowledge = [];

      this.userService.getAuthors().subscribe({
        next: (data: UserDto[]) => {
          this.authors = data;
          this.selectedAuthors.forEach((author) => {
            this.knowledge = this.removeDuplicates([...this.knowledge, ...author.knowledges]);
          });
          this.filterOnlyPublicKnowledge();
        },
        error: (err) => {
          console.error("Error fetching Authors ", err);
        }
      });
    }

    filterOnlyPublicKnowledge() {
      this.knowledge = this.knowledge.filter((knowledge: Knowledge) => knowledge.isPublicKnowledge);
    }

  removeDuplicates(array: Knowledge[]): Knowledge[] {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => t.title === item.title && t.content === item.content)
    );
  }

  getFirstWords(content: string, wordCount: number): string {
    if (!content) return '';
    const words = content.split(' ');
    return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : content;
  }

  selectKnowledge(knowledge: Knowledge){
      this.selectedKnowledge = knowledge;
      this.router.navigate(['knowledge/detail', knowledge.idKnowledge]);
    }

 searchKnowledgeAdvanced(searchText: string){
       if (searchText.trim() !== ''){
            this.service.findBy(searchText).subscribe({
               next: (data: Knowledge[]) => {
                   this.knowledge = data;
                 },
               error: err=> console.log(err)
               })
         } else if (this.selectedCategories.length > 0){
            this.loadKnowledgeFromCategories();
         } else {
           this.loadKnowledge();
           }
       }

   searchKnowledgeSimple(searchText: string){
       if (searchText.trim() !== ''){
         this.service.getKnowledgeByTitlePhrase(searchText).subscribe({
           next: (data: Knowledge[]) => {
             this.knowledge = data;
             },
           error: err => console.log(err)
           })
        } else if (this.selectedCategories.length > 0){
          this.loadKnowledgeFromCategories();
          } else {
             this.loadKnowledge();
             }
     }

}
