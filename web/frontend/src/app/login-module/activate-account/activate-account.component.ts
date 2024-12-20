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

// Modified by: Katarzyna Badio on 5.11.2024

import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule, CodeInputModule ],
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
})

export class ActivateAccountComponent {

    message = '';
    isOkay = false;
    submitted = false;
    code = '';

    constructor(
      private router: Router,
      private authService: AuthenticationService
    ) {}

    private confirmAccount() {
      if (!this.code || this.code.trim().length === 0) {
            this.message = 'Please enter a valid activation code';
            return;
          }

      const token = this.code.trim();
      this.authService.confirm({ token }).subscribe({
        next: () => {
          this.message = 'Your account has been successfully activated. Now you can proceed to login';
        },
        error: () => {
          this.message = 'Token has expired or is invalid';
        }
      });
    }

    submitCode() {
       this.submitted = false;
       this.confirmAccount();

    }

    redirectToLogin() {
      this.router.navigate(['login']);
    }
  }


