import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit {

    step: 'request' | 'change' | 'save' = 'request';
    email: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    token: string | null = null;
    message: string = '';

    constructor(
     private passwordService: PasswordService,
     private route: ActivatedRoute,
     private router: Router
      ){}

      ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
        if (this.token){
          this.step = 'change';
          }
        }

      // request password reset
      requestReset(){
        this.passwordService.requestPasswordReset(this.email).subscribe(
          (response) => {
            this.message = response.message;
            this.step = 'change';
            },
          (error) => {
            console.error(error);
            this.message = error.error.message || 'Error sending reset link.';
             }
          );
        }

      // change password (validate token and proceed to enter new password)
      validateToken(){
        if (!this.token){
          this.message = 'Invalid or missing token';
          return;
          }
        this.passwordService.validateToken(this.token).subscribe(
          (response) => {
              this.message = response.message;
              this.step = 'save';
            },
          (error) => {
            console.error(error);
            this.message = error.error.message || 'Invalid token';
            this.step = 'request';
            }
          );
        }

      // save new password
      savePassword(){

        if (!this.token) {
            console.error("Token is missing!");
            this.message = "Token is missing!";
            return;
          }

        if (this.newPassword !== this.confirmPassword){
          this.message = "Passwords don't match!";
          return;
          }

        const passwordDto = {
          token: this.token,
          newPassword: this.newPassword,
          };


        this.passwordService.saveNewPassword(passwordDto).subscribe(
          (response) => {
            this.message = response.message;
            this.step = 'request';
            },
          (error) => {
            console.error(error);
            this.message = error.error.message || 'Error changing password';
            }
          );
        }

      redirectToLogin() {
          this.router.navigate(['']);
      }

}
