import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrlCategories;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }

  getCategories(): Observable<Category[]>{
    const url = `${this.apiUrl}/all`;
    return this.http.get<Category[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getCategory(id?: number, categoryName?: string): Observable<Category>{

    let params = new HttpParams();
    if (id){
      params = params.set('id', id.toString());
      console.log("Service: id: " + id.toString());
      }
    if (categoryName){
      params = params.set('categoryName', categoryName);
      console.log("Service: categoryName: " + categoryName);
      }

    return this.http.get<Category>(this.apiUrl, {params});
    }

//   getCategoryById(id: number): Observable<Category>{
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.get<Category>(url).pipe(catchError(this.errorHandlingService.handleError));
//     }
//
//   getCategoryByName(categoryName: string) {
//     const url = `${this.apiUrl}/${categoryName}`;
//     return this.http.get<Category>(url).pipe(catchError(this.errorHandlingService.handleError));
//     }

  findByCategoryName(name: string){
    const url = `${this.apiUrl}/searchAll/${name}`;
    return this.http.get<Category[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  createCategory(category: Category): Observable<Category>{
    return this.http.post<Category>(this.apiUrl, category).pipe(catchError(this.errorHandlingService.handleError));
    }

  deleteCategory(id: number): Observable<void>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
