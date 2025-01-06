import { Injectable } from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { UserDto } from '../models/user-dto';
import { User } from '../models/user';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import {TokenService} from "../token/token.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = environment.apiUrlUsers;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private tokenService: TokenService
  ) { }


  private getHeaders(): HttpHeaders {
    const token = this.tokenService.token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


   deleteRole(idUser: number, roleName: string){
    const url = `${this.apiUrl}/deleteRole/${idUser}/${roleName}`;
    const body = {};
    const headers = this.getHeaders();
    return this.http.post<void>(url, body, { headers }).pipe(catchError(this.errorHandlingService.handleError));
    }


  addRole(idUser: number, roleName: string){
    const url = `${this.apiUrl}/addRole/${idUser}/${roleName}`;
    const body = {};
    const headers = this.getHeaders();
    return this.http.post<void>(url, body, { headers }).pipe(catchError(this.errorHandlingService.handleError));
    }


  changeFirstNameandLastName(idUser: number, firstName: string, lastName: string){
    const url = `${this.apiUrl}/changeNameAndSurname/${idUser}/${firstName}/${lastName}`;
    const body = {};
    const headers = this.getHeaders();
    return this.http.put<UserDto>(url, body, { headers }).pipe(catchError(this.errorHandlingService.handleError));
    }

  getUsersNotAdmins(){
    const url = `${this.apiUrl}/all`;
    const headers = this.getHeaders();
    return this.http.get<User[]>(url, { headers }).pipe(catchError(this.errorHandlingService.handleError));
    }

  getUserIdByEmail(email: string){
    const url = `${this.apiUrl}/getUserIdByEmail/${email}`;
    return this.http.get<number>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getUserByEmail(email: string){
    const url = `${this.apiUrl}/getUserByEmail/${email}`;
    return this.http.get<User>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getAuthors(){
    const url = `${this.apiUrl}/allAuthors`;
    return this.http.get<UserDto[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
