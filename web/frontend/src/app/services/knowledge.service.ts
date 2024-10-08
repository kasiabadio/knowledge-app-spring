import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Knowledge } from '../models/knowledge';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})

export class KnowledgeService {
  private apiUrl = environment.apiUrlKnowledge;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
    ) { }

  getKnowledge(): Observable<Knowledge[]>{
    const url = `${this.apiUrl}/all`;
    return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getKnowledgeById(id: number): Observable<Knowledge> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Knowledge>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getKnowledgeByTitleAndAuthor(title: string, author: string){
      const url = `${this.apiUrl}/${title}/${author}`;
      return this.http.get<Knowledge>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  getKnowledgeByTitlePhrase(titlePhrase: string){
      const url = `${this.apiUrl}/search/${titlePhrase}`;
      return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  findBy(phrase: string){
      const url = `${this.apiUrl}/searchAll/${phrase}`;
      return this.http.get<Knowledge[]>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

  createKnowledge(knowledge: Knowledge): Observable<Knowledge> {
      return this.http.post<Knowledge>(this.apiUrl, knowledge).pipe(catchError(this.errorHandlingService.handleError));
    }

  updateKnowledge(knowledge: Knowledge): Observable<Knowledge>{
    const url = `${this.apiUrl}/${knowledge.idKnowledge}`
    return this.http.put<Knowledge>(url, knowledge).pipe(catchError(this.errorHandlingService.handleError));
    }

  deleteKnowledge(id: number): Observable<void>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
