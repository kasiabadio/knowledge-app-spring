import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationHistoryService } from './services/navigation-history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private navigationHistoryService: NavigationHistoryService) {

  }
}
