import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { ErrorHandlingService } from './error-handling.service';
import { Comment } from '../models/comment';
import { HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import {TokenService} from "../token/token.service";


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiUrlComments;
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

    allCommentsForUser(idUser: number){
      const url = `${this.apiUrl}/allCommentsForUser/${idUser}`;
      const headers = this.getHeaders();
      return this.http.get<Comment[]>(url, { headers }).pipe(catchError(this.errorHandlingService.handleError));
      }

    deleteComment(idUser: number, idKnowledge: number, idComment: number){
      const url = `${this.apiUrl}/delete/${idUser}/${idKnowledge}/${idComment}`;
      const headers = this.getHeaders();
      return this.http.delete<void>(url, { headers }).pipe(catchError(this.errorHandlingService.handleError));
    }

    createComment(idUser: number, idKnowledge: number, content: string){
        const url = `${this.apiUrl}/add/${idUser}/${idKnowledge}/${content}`;
        let params = new HttpParams().set('idUser', idUser).set('idKnowledge', idKnowledge).set('content', content);
        return this.http.post<Comment>(url, { params }).pipe(catchError(this.errorHandlingService.handleError));
     }

}
