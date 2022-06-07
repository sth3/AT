import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ComponentModel } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { environmentComponents } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  getComponents(): Observable<ComponentModel[]> {
    return this.http.get<ComponentModel[]>(`${environmentComponents.apiUrl}/components`);
  }

  updateComponent(id: string, component: ComponentModel) {
    return this.http.put<ComponentModel>(`${environmentComponents.apiUrl}/components/${id}`, component);
  }

  deleteComponent(id: string) {
    return this.http.delete(`${environmentComponents.apiUrl}/components/${id}`);
  }

  addComponent(component: ComponentModel): Observable<ComponentModel> {
    return this.http.post<ComponentModel>(`${environmentComponents.apiUrl}/components`, component);
  }
}
