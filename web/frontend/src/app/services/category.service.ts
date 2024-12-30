import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryDto } from '../models/category-dto';
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

    return this.http.get<Category>(this.apiUrl, {params}).pipe(catchError(this.errorHandlingService.handleError));
    }

  findByCategoryName(name: string){
    const url = `${this.apiUrl}/searchAll/${name}`;
    return this.http.get<Category[]>(url).pipe(catchError(this.errorHandlingService.handleError));
  }

  createCategory(category: CategoryDto): Observable<Category>{
     const url = `${this.apiUrl}/add`;
    return this.http.post<Category>(url, category).pipe(catchError(this.errorHandlingService.handleError));
  }

  deleteCategory(categoryName: string): Observable<void>{
    const url = `${this.apiUrl}/delete/${categoryName}`;
    return this.http.delete<void>(url).pipe(catchError(this.errorHandlingService.handleError));
  }
}
