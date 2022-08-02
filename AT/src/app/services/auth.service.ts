import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { DialogService } from './dialog.service';
import { AuthDialogComponent } from '../components/auth-dialog/auth-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  constructor(private dialogService: DialogService,
              private http: HttpClient) {
    console.log('AuthService.constructor');
    setTimeout(() => {
      this.getCurrentUser().subscribe(user => {
        console.log('current user called: ', user);
        this.user$.next(user);
      });
    });
  }

  setUser(user: UserModel) {
    this.user$.next(user);
  }

  getUser(): UserModel | null {
    return this.user$.value;
  }

  isLoggedIn(): boolean {
    return this.user$ !== null;
  }

  login({ username, password }: { username: string, password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrl}/login`, { username, password }, { withCredentials: true });
  }

  logout() {
    this.user$.next(null);
    return this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true });
  }

  promptLogin(message: string) {
    this.dialogService.customDialog(AuthDialogComponent, { message }, { width: '275px', height: '300px', disableClose: true })
      .subscribe(result => {
        if (result) {
          this.login(result).subscribe((user: UserModel) => {
            console.log('login response: ', user);
            this.setUser(user);
          });
        }
      });
  }

  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrl}/currentUser`, { withCredentials: true });
  }

  testAdmin() {
    return this.http.get(`${environment.apiUrl}/testAuthAdmin`, { withCredentials: true });
  }

  testOperator() {
    return this.http.get(`${environment.apiUrl}/testAuthOperator`, { withCredentials: true });
  }
}
