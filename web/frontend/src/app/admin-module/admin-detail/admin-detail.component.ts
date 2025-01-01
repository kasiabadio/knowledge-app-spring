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
     currentUser: User | null = null;
     actions: string[] = ["ADD", "REMOVE"];
     permissions: string[] = ["AUTHOR", "ADMIN"];
     selectedAction: string = "ADD";
     selectedPermission: string = "AUTHOR";


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

           this.users = data.map((user) => ({
                     ...user,
                     selectedAction: 'ADD',
                     selectedPermission: 'AUTHOR',
                   }));
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

     changePermissions(user: any){
       console.log("Change permissions");
       this.currentUser = user;
       console.log('Current User:', this.currentUser);
       console.log('Selected Action:', user.selectedAction);
       console.log('Selected Permission:', user.selectedPermission);

        if (this.currentUser?.idUser === undefined ||
          this.currentUser?.selectedPermission === undefined ||
          this.currentUser?.selectedAction === undefined) {
            console.error('idUser or selectedPermission or selectedAction is undefined');
            return;
          }

        if (this.currentUser?.selectedAction === 'ADD'){

          this.userService.addRole(this.currentUser?.idUser, this.currentUser?.selectedPermission).subscribe({
                 next: () => {
                   this.provideUserDetails();
                   },
                 error: (err) => {
                      console.error("Error while fetching users: ", err);
                   }
                 });
           } else if (this.currentUser?.selectedAction === 'REMOVE'){
             this.userService.deleteRole(this.currentUser?.idUser, this.currentUser?.selectedPermission).subscribe({
                 next: () => {
                   this.provideUserDetails();
                   },
                 error: (err) => {
                      console.error("Error while fetching users: ", err);
                   }
                 });
             }

        }

}
