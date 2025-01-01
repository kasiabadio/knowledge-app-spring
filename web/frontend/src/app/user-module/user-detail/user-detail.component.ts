import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../token/token.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ NgFor, NgIf, ReactiveFormsModule, FormsModule ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

      user: User | null = null;
      userForm: FormGroup;

      constructor(private fb: FormBuilder,
        private userService: UserService,
        private tokenService: TokenService) {
        this.userForm = this.fb.group({
          firstName: ['', [Validators.required, Validators.minLength(2)]],
          lastName: ['', [Validators.required, Validators.minLength(2)]],
        });
      }

    ngOnInit(){
      this.getUser();
    }

    getUser(){
      const email = this.tokenService.currentUser?.email ?? '';

        this.userService.getUserByEmail(email).subscribe({
            next: (data: User) => {
              this.user = data;
              },
            error: (err) => console.log(err),
            })
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
