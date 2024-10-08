import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Knowledge } from '../../models/knowledge';
import { KnowledgeService } from '../../services/knowledge.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledge-list',
  templateUrl: './knowledge-list.component.html',
  styleUrls: ['./knowledge-list.component.css'],
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule ],
  providers: [ KnowledgeService ]
})

export class KnowledgeListComponent implements OnInit {
  knowledge: Knowledge[] = [];
  selectedKnowledge: Knowledge | undefined;


  constructor(private service: KnowledgeService, private router: Router){}

  ngOnInit(){
        this.loadKnowledge();
        }

  loadKnowledge(){
      this.service.getKnowledge().subscribe({
              next: (data: Knowledge[]) => {
                  this.knowledge = data;
                },
              error: err=> console.log(err)
              })
    }

  selectKnowledge(knowledge: Knowledge){
      this.selectedKnowledge = knowledge;
      console.log("Navigate to: " + knowledge.idKnowledge);
      this.router.navigate(['/detail', knowledge.idKnowledge]);
    }

  deleteKnowledge(knowledge: Knowledge){
    console.log("Delete by id: " + knowledge.idKnowledge);
    this.service.deleteKnowledge(knowledge.idKnowledge).subscribe({
      error: err=>console.log(err)
      });
    this.loadKnowledge();
   }

  searchKnowledge(searchText: string){
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

  addKnowledge(){
    this.router.navigate(['/form']);
  }

  navigateToCategories(){
    this.router.navigate(['/categories']);
    }

}