import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Knowledge } from '../models/knowledge';
import { Category } from '../models/category';
import { KnowledgeDto } from '../models/knowledge-dto';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class KnowledgeService {
  private apiUrl = environment.apiUrlKnowledge;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }

  // --------------- PRIVATE KNOWLEDGE --------------

  getAllPrivateKnowledge(idUser: number): Observable<Knowledge[]>{
    const url = `${this.apiUrl}/allPrivateForUser/${idUser}`;
    return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getPrivateKnowledgeById(idUser: number, idKnowledge: number): Observable<Knowledge> {
        const url = `${this.apiUrl}/getPrivateById/${idUser}/${idKnowledge}`;
        return this.http.get<Knowledge>(url).pipe(catchError(this.errorHandlingService.handleError));
      }


  // --------------- PUBLIC KNOWLEDGE ----------------
  getKnowledge(): Observable<Knowledge[]>{
    const url = `${this.apiUrl}/all`;
    return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getAuthorId(id: number){
    const url = `${this.apiUrl}/getAuthorEmail/${id}`;
    return this.http.get<number>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getAllCategories(id: number){
    const url = `${this.apiUrl}/getAllCategories/${id}`;
    return this.http.get<any[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getAllComments(id: number){
    const url = `${this.apiUrl}/getAllComments/${id}`;
    return this.http.get<any[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }


  getKnowledgeById(id: number): Observable<Knowledge> {
      const url = `${this.apiUrl}/getById/${id}`;
      return this.http.get<Knowledge>(url).pipe(catchError(this.errorHandlingService.handleError));
    }


  getKnowledgeByTitlePhrase(titlePhrase: string){
      const url = `${this.apiUrl}/searchByPhrase/${titlePhrase}`;
      return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  findBy(phrase: string){
      const url = `${this.apiUrl}/searchAllByPhrase/${phrase}`;
      return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  createKnowledge(knowledge: KnowledgeDto, categories: string[]): Observable<Knowledge> {
      const url = `${this.apiUrl}/add`
      let params = new HttpParams().set('categories', categories.join(','));
      return this.http.post<any>(url, knowledge, { params }).pipe(catchError(this.errorHandlingService.handleError));
    }

  updateKnowledge(knowledge: KnowledgeDto, idKnowledge: number, categories: string[]): Observable<Knowledge>{
    const url = `${this.apiUrl}/update/${idKnowledge}`;
    let params = new HttpParams().set('categories', categories.join(','));
    return this.http.put<any>(url, knowledge, { params }).pipe(catchError(this.errorHandlingService.handleError));
    }

  deleteKnowledge(id: number): Observable<void>{
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
