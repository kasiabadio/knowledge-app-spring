import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryDto } from '../models/category-dto';
import {HttpClientModule, HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {TokenService} from "../token/token.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrlCategories;
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

  getCategories(): Observable<Category[]>{
    const url = `${this.apiUrl}/all`;
    return this.http.get<Category[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getCategory(id?: number, categoryName?: string): Observable<Category>{

    let params = new HttpParams();
    if (id){
      params = params.set('id', id.toString());
      }
    if (categoryName){
      params = params.set('categoryName', categoryName);
      }

    return this.http.get<Category>(this.apiUrl, {params}).pipe(catchError(this.errorHandlingService.handleError));
    }

  findByCategoryName(name: string){
    const url = `${this.apiUrl}/searchAll/${name}`;
    return this.http.get<Category[]>(url).pipe(catchError(this.errorHandlingService.handleError));
  }

  createCategory(category: CategoryDto): Observable<Category>{
     const url = `${this.apiUrl}/add`;
    const headers = this.getHeaders();
    return this.http.post<Category>(url, category, { headers }).pipe(catchError(this.errorHandlingService.handleError));
  }

  deleteCategory(categoryName: string): Observable<void>{
    const url = `${this.apiUrl}/delete/${categoryName}`;
    const headers = this.getHeaders();
    return this.http.delete<void>(url, { headers }).pipe(catchError(this.errorHandlingService.handleError));
  }
}
