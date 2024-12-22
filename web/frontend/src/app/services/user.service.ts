import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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

  getUserIdByEmail(email: string){
    const url = `${this.apiUrl}/getUserIdByEmail/${email}`;
    return this.http.get<number>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getUserByEmail(email: string){
    const url = `${this.apiUrl}/getUserByEmail/${email}`;
    return this.http.get<User>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
