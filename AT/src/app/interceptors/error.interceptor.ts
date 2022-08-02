import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private inj: Injector,
              private notifier: NotifierService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.inj.get(AuthService);
    return next.handle(req)
      .pipe(catchError((err: HttpErrorResponse) => {
          const error = err.error?.message || err.statusText;
          if (!navigator.onLine) {
            this.notifier.showNotification('No internet connection', 'Ok', 'error');
          } else if (err.status === 401) {
            if (err.error?.message) {
              authService.promptLogin('Login');
              this.notifier.showNotification(err.error.message, 'Ok', 'error');
            } else {
              authService.promptLogin('Login to continue');
              this.notifier.showNotification('Unauthorized', 'Ok', 'error');
            }
          } else if (err.status === 403) {
            if (err.error?.message) {
              this.notifier.showNotification(err.error.message, 'Ok', 'error');
            } else {
              this.notifier.showNotification('Your role is not sufficient for this operation.', 'Ok', 'error');
            }
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
