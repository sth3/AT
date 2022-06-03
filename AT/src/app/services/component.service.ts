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

  updateComponent(id: string, component: ComponentModel) {
    return this.http.put<ComponentModel>(`${environment.apiUrl}/components/${id}`, component);
  }

  deleteComponent(id: string) {
    return this.http.delete(`${environment.apiUrl}/components/${id}`);
  }

  addComponent(component: ComponentModel) {
    return this.http.post(`${environment.apiUrl}/components`, component);
  }
}
