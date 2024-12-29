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
  selector: 'app-private-knowledge-list',
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule
    ],
  templateUrl: './private-knowledge-list.component.html',
  styleUrl: './private-knowledge-list.component.css',
  providers: [ KnowledgeService ]
})
export class PrivateKnowledgeListComponent implements OnInit {
    knowledge: Knowledge[] = [];
    selectedKnowledge: Knowledge | undefined;
    token: string = '';
    idUser: number = -1;


  constructor(private service: KnowledgeService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
    ){}

   ngOnInit(){
     this.token = this.tokenService.token;
     this.getIdUser();
     this.loadKnowledge();
     }

    getIdUser(){
      const userEmail = this.tokenService?.currentUser?.email;

        if (!userEmail) {
          console.error("User email is undefined or null.");
          return;
        }

        this.userService.getUserIdByEmail(userEmail).subscribe({
          next: (data: any) => {
            this.idUser = data;
          },
          error: (err) => {
            console.log("Error fetching id user from email");
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
        });
      }

    loadKnowledge() {
       this.service.getAllPrivateKnowledge(this.idUser).subscribe({
         next: (data: any[]) => {
           console.log('Fetched Knowledge:', data);
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


     getFirstWords(content: string, wordCount: number): string {
       if (!content) return '';
       const words = content.split(' ');
       return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : content;
     }

     selectKnowledge(knowledge: Knowledge){
         this.selectedKnowledge = knowledge;
         console.log("Navigate to: " + knowledge.idKnowledge);
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
             } else {
                this.loadKnowledge();
                }
        }
}
