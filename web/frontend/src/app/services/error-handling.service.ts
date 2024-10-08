import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        switch (error.status) {
            case 400:
              errorMessage = 'Bad Request: The server could not understand the request.';
              break;
            case 401:
              errorMessage = 'Unauthorized: Access is denied due to invalid credentials.';
              break;
            case 403:
              errorMessage = 'Forbidden: You do not have permission to access the resource.';
              break;
            case 404:
              errorMessage = 'Not Found: The requested resource could not be found.';
              break;
            case 500:
              errorMessage = 'Internal Server Error: An error occurred on the server.';
              break;
            default:
              errorMessage = `Unexpected error occurred: ${error.message}`;
              break;
          }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }
}
