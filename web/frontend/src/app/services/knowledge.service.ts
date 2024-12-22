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

  createKnowledge(knowledge: Knowledge): Observable<Knowledge> {
      const url = `${this.apiUrl}/add`
      return this.http.post<Knowledge>(url, knowledge).pipe(catchError(this.errorHandlingService.handleError));
    }

  updateKnowledge(knowledge: Knowledge): Observable<Knowledge>{
    const url = `${this.apiUrl}/update/${knowledge.idKnowledge}`;
    return this.http.put<Knowledge>(url, knowledge).pipe(catchError(this.errorHandlingService.handleError));
    }

  deleteKnowledge(id: number): Observable<void>{
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.errorHandlingService.handleError));
    }

}
