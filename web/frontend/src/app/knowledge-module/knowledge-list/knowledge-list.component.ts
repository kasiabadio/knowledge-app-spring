import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Knowledge } from '../../models/knowledge';
import { KnowledgeService } from '../../services/knowledge.service';
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

  constructor(private service: KnowledgeService,  private tokenService: TokenService, private router: Router){}

  ngOnInit(){
        this.token = this.tokenService.token;
        console.log("Knowledge list public initialized");
        this.loadKnowledge();
        }

  loadKnowledge(){
      this.service.getKnowledge().subscribe({
        next: (data: Knowledge[]) => {
            console.log('Fetched Knowledge: data');
            this.knowledge = data;
          },
        error: err=> console.log(err)
        })
    }

  getFirstWords(content: string, wordCount: number): string {
    if (!content) return '';
    const words = content.split(' ');
    return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : content;
  }

// TODO: only if author
  selectKnowledge(knowledge: Knowledge){
      this.selectedKnowledge = knowledge;
      console.log("Navigate to: " + knowledge.idKnowledge);
      this.router.navigate(['knowledge/detail', knowledge.idKnowledge]);
    }

// TODO: only if author
  deleteKnowledge(knowledge: Knowledge){
    console.log("Delete by id: " + knowledge.idKnowledge);
    this.service.deleteKnowledge(knowledge.idKnowledge).subscribe({
      error: err=>console.log(err)
      });
    this.loadKnowledge();
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
