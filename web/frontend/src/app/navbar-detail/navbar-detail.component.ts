import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../token/token.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-navbar-detail',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf],
  templateUrl: './navbar-detail.component.html',
  styleUrls: ['./navbar-detail.component.css']
})
export class NavbarDetailComponent implements OnInit {

    constructor (public tokenService: TokenService) {}
    ngOnInit () {

      }
}
