// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) { }
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // add auth header with jwt if user is logged in and request is to api url
//     const user = this.authService.user$.value;
//     const isLoggedIn = user && user.token;
//     const isApiUrl = request.url.startsWith(environment.apiUrl);
//     if (isLoggedIn && isApiUrl) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${user.token}`
//         }
//       });
//     }
//
//     return next.handle(request);
//   }
// }
