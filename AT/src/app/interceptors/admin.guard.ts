import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable(
  { providedIn: 'root' }
)
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService) {
  }

  // a bit hacky, but it has timeout to go after checking user on reload
  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setTimeout(() => {
        observer.next(this.auth.isLoggedIn() && this.auth.isAdmin());
      }, 100);
    })
  }
}
