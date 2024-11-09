import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private apiUrl = environment.apiUrlPassword;
  constructor(private http: HttpClient) {}

  requestPasswordReset(email: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetPassword`, { email })
    }

  validateToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/changePassword`, { params: { token } });
    }

  saveNewPassword(passwordDto: { token: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/savePassword`, passwordDto);
    }
}
