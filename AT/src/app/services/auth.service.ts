import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from './dialog.service';
import { AuthDialogComponent } from '../components/auth-dialog/auth-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  constructor(private dialogService: DialogService) {
  }

  setUser(user: UserModel) {
    this.user$.next(user);
  }

  getUser(): UserModel | null {
    return this.user$.value;
  }

  isLoggedIn(): boolean {
    return this.user$ != null;
  }

  login() {
    console.log('login');
  }

  logout() {

  }

  promptLogin(message: string) {
    this.dialogService.customDialog(AuthDialogComponent, { message }, { width: '400px', height: '200px' })
      .subscribe(result => {
        if (result) {
          this.login();
        }
      });
  }
}
