import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private notifier: NotifierService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError((err: HttpErrorResponse) => {
          const error = err.error.message || err.statusText;
          if (!navigator.onLine) {
            this.notifier.showNotification('No internet connection', 'Ok', 'error');
          } else if (err.status === 401) {
            this.authService.promptLogin('Login to continue');
            this.notifier.showNotification('Unauthorized', 'Ok', 'error');
          } else if (err.status === 403) {
            this.notifier.showNotification('Your role is not sufficient for this operation.', 'Ok', 'error');
          } else if (err.status >= 500) {
            this.notifier.showNotification('Server error: ' + error, 'Ok', 'error');
          } else {
            this.notifier.showNotification(error, 'Ok', 'error');
          }

          return throwError(() => error);
        })
      );
  }
}
