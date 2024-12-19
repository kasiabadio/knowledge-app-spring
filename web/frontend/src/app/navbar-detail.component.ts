import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-detail.component.html',
  styleUrls: ['./navbar-detail.component.css']
})
export class NavbarDetailComponent implements OnInit {
    constructor () {}
    ngOnInit () {}
}
