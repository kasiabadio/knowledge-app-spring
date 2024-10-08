import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CategoryKnowledgeGroup } from '../models/categoryknowledgegroup';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryknowledgegroupService {
  private apiUrl = environment.apiUrlCategoriesKnowledges;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }

    getCategoryKnowledgeGroupsByCategory(categoryId: number) {
      const url = `${this.apiUrl}/by-category/${categoryId}`;
      return this.http.get<CategoryKnowledgeGroup[]>(url).pipe(catchError(this.errorHandlingService.handleError));
      }

    getCategoryKnowledgeGroupByKnowledge(knowledgeId: number) {
      const url = `${this.apiUrl}/by-knowledge/${knowledgeId}`;
      return this.http.get<CategoryKnowledgeGroup[]>(url).pipe(catchError(this.errorHandlingService.handleError));
      }

    getCategoryKnowledgeGroup(categoryName: string, knowledgeId: number) {
      const url = `${this.apiUrl}/element/${categoryName}/${knowledgeId}`;
      return this.http.get<CategoryKnowledgeGroup>(url).pipe(catchError(this.errorHandlingService.handleError));
      }

    createCategoryKnowledgeGroup(ckg: CategoryKnowledgeGroup){
      return this.http.post<CategoryKnowledgeGroup>(this.apiUrl, ckg).pipe(catchError(this.errorHandlingService.handleError));
      }
}
