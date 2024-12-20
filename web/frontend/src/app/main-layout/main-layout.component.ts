import { Component } from '@angular/core';
import { NavbarDetailComponent } from '../navbar-detail/navbar-detail.component';
import { SidebarDetailComponent } from '../sidebar-detail/sidebar-detail.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavbarDetailComponent, SidebarDetailComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
