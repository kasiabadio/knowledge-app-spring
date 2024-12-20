// Copyright 2024 Ali Bouali
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Modified by: Katarzyna Badio on 3.11.2024

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service.service';
import { TokenService } from '../../token/token.service';
import { AuthenticationRequest } from '../../models/authentication-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];
  token: string = '';

   constructor(private router: Router, private authService: AuthenticationService, private tokenService: TokenService){}

  ngOnInit(){
    this.token = this.tokenService.token || '';
      if (this.token) {
        this.router.navigate(['']);
      }
    }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.token = this.tokenService.token;
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.errorMsg);
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  passwordReset(){
    this.router.navigate(['password-reset'])
  }

  backToKnowledge(){
    this.router.navigate(['knowledge'])
    }
}
