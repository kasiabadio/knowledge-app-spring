import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';

import { TokenService } from '../../token/token.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user';
import { Comment } from '../../models/comment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ NgFor, NgIf, ReactiveFormsModule, FormsModule ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

      user: User | null = null;
      comments: Comment[] = [];
      userForm: FormGroup;

      constructor(private fb: FormBuilder,
        private userService: UserService,
        private commentService: CommentService,
        private tokenService: TokenService,
        private router: Router) {
        this.userForm = this.fb.group({
          firstName: ['', [Validators.required, Validators.minLength(2)]],
          lastName: ['', [Validators.required, Validators.minLength(2)]],
        });
      }

    ngOnInit(){
      let email = this.tokenService.currentUser?.email;
      if (email === undefined){
        this.router.navigate(["knowledge"]);
      } else {
        this.getUser();
      }
    }

    getUser(){
      const email = this.tokenService.currentUser?.email ?? '';

        this.userService.getUserByEmail(email).subscribe({
            next: (data: User) => {
              this.user = data;
              this.getComments();
              },
            error: (err) => console.log(err),
            })
    }

   getComments(){
      if (this.user?.idUser !== undefined) {
          this.commentService.allCommentsForUser(this.user.idUser).subscribe({
            next: (data: any[]) => {
              console.log('Comments data:', data);
              this.comments = data;
            },
            error: (err) => console.error('Error fetching comments:', err),
          });
        } else {
          console.error('User ID is undefined');
        }
     }

   navigateToKnowledge(knowledgeId: number | undefined): void {
       if (knowledgeId) {
         this.router.navigate(['/knowledge/detail/', knowledgeId]);
       } else {
         console.error('Knowledge ID is undefined');
       }
     }

   getFirstWords(content: string, wordCount: number): string {
       if (!content) return '';
       const words = content.split(' ');
       return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : content;
     }

    onSubmitChangeNameAndSurname() {
        if (this.userForm.valid && this.user?.idUser !== undefined) {
          console.log('Form Submitted', this.userForm.value);
          this.userService.changeFirstNameandLastName(
            this.user?.idUser,
            this.userForm.get("firstName")?.value,
            this.userForm.get("lastName")?.value).subscribe({
              next: () => {
                    this.getUser();
                },
              error: (err) => {
                console.log("Error changing first name and last name");
                }
              })
        } else {
          console.log('Form is invalid');
        }
      }



}
