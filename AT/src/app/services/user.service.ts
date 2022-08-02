import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrl}/currentUser`, { withCredentials: true });
  }

  getUsers() {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/users`, { withCredentials: true });
  }

  addUser(user: UserModel) {
    return this.http.post(`${environment.apiUrl}/users`, user, { withCredentials: true });
  }

  updateUser(id: number, user: UserModel) {
    console.log('update user: ', user);
    return this.http.put(`${environment.apiUrl}/users/${id}`, user, { withCredentials: true });
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`, { withCredentials: true });
  }

  changePassword(id: number, result: any) {
    return this.http.put(`${environment.apiUrl}/users/${id}/password`,
      { oldPassword: result.oldPassword, newPassword: result.newPassword },
      { withCredentials: true });
  }
}
