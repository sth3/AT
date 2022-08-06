import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ComponentModel } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  getComponents(): Observable<ComponentModel[]> {
    return this.http.get<ComponentModel[]>(`${environment.apiUrl}/components`);
  }

  updateComponent(no: number, component: ComponentModel) {
    return this.http.put<ComponentModel>(`${environment.apiUrl}/components/${no}`, component, { withCredentials: true });
  }

  deleteComponent(no: string) {
    return this.http.delete(`${environment.apiUrl}/components/${no}`, { withCredentials: true });
  }

  addComponent(component: ComponentModel): Observable<ComponentModel> {
    return this.http.post<ComponentModel>(`${environment.apiUrl}/components`, component, { withCredentials: true });
  }
}
