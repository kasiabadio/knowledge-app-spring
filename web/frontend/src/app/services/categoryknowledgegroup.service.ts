import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CategoryKnowledgeGroup } from '../models/categoryknowledgegroup';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import { Category } from '../models/category';
import { Knowledge } from '../models/knowledge';

@Injectable({
  providedIn: 'root'
})
export class CategoryKnowledgeGroupService {
  private apiUrl = environment.apiUrlCategoriesKnowledges;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }

  getAllKnowledgesFromCategory(categoryName: string){
    const url = `${this.apiUrl}/getKnowledges/${categoryName}`;
    return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
