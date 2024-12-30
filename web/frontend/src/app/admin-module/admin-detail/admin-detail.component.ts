import { Component } from '@angular/core';
import { CategoryListComponent } from '../../category-module/category-list/category-list.component';

@Component({
  selector: 'app-admin-detail',
  standalone: true,
  imports: [ CategoryListComponent ],
  templateUrl: './admin-detail.component.html',
  styleUrl: './admin-detail.component.css'
})
export class AdminDetailComponent {

}
