import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../token/token.service';
import { KnowledgeService } from '../services/knowledge.service';
import { Knowledge } from '../models/knowledge';

@Component({
  selector: 'app-sidebar-detail',
  standalone: true,
  imports: [ NgIf, NgFor, CommonModule, FormsModule ],
  templateUrl: './sidebar-detail.component.html',
  styleUrl: './sidebar-detail.component.css'
})
export class SidebarDetailComponent {

    constructor(private service: KnowledgeService,
      public tokenService: TokenService,
      private router: Router){}


    addKnowledge(){
        this.router.navigate(['knowledge/form']);
      }


    login(){
      this.router.navigate(['login'])
      }

    logout(){
      this.tokenService.token = '';
      }


}
