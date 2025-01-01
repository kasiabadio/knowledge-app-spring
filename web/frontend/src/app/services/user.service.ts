import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UserDto } from '../models/user-dto';
import { User } from '../models/user';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = environment.apiUrlUsers;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }


  changeFirstNameandLastName(firstName: string, lastName: string){
    const url = `${this.apiUrl}/changeNameAndSurname/{firstName}/{lastName}`;
    const body = {};
    return this.http.put<UserDto>(url, body).pipe(catchError(this.errorHandlingService.handleError));
    }

  getUsersNotAdmins(){
    const url = `${this.apiUrl}/all`;
    return this.http.get<User[]>(url).pipe(catchError(this.errorHandlingService.handleError));
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
