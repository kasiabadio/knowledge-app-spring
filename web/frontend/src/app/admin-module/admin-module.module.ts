import { NgModule } from '@angular/core';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from '../services/admin.service';

@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminDetailComponent
    ],
  exports: [
    AdminDetailComponent
    ],
  providers: [AdminService],
  bootstrap: []
  })
export class AdminModuleModule { }
