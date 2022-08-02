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
    return this.http.get<UserModel>(`${environment.apiUrl}/currentUser`);
  }

  getUsers() {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/users`);
  }

  addUser(user: UserModel) {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  updateUser(user: UserModel) {
    return this.http.put(`${environment.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }

}
