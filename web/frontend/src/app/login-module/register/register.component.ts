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

import { RegistrationRequest } from '../../models/registration-request';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { AuthenticationService } from '../../services/authentication-service.service';
import { TokenService } from '../../token/token.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerRequest: RegistrationRequest = {email: '', firstName: '', lastName: '', password: ''}
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService
    ){}

  register(){
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
      }).subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
          },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
          }
        })
    }

  login(){
    this.router.navigate(['login']);
  }
}
