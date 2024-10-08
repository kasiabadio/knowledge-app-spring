import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KnowledgeListComponent } from './knowledge-module/knowledge-list/knowledge-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KnowledgeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
