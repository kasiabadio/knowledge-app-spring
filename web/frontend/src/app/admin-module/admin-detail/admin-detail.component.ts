import { Component, OnInit } from '@angular/core';
import { CategoryListComponent } from '../../category-module/category-list/category-list.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-detail',
  standalone: true,
  imports: [
        CategoryListComponent,
        NgFor,
        CommonModule,
        FormsModule,
        ],
  templateUrl: './admin-detail.component.html',
  styleUrl: './admin-detail.component.css'
})
export class AdminDetailComponent implements OnInit {
     users: User[] = [];

     constructor(
       private userService: UserService
       ){}

     ngOnInit(){
       this.provideUserDetails();
       }

     provideUserDetails(){
       this.userService.getUsersNotAdmins().subscribe({
         next: (data: any[]) => {
           this.users = data;
           },
         error: (err) => {
             console.error("Error while fetching users: ", err);
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

}
