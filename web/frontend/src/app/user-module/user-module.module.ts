import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UserDetailComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    UserDetailComponent
    ],
  providers: [UserService],
  bootstrap: []
})
export class UserModuleModule { }
