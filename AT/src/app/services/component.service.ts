import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComponentChangeModel, ComponentModel } from '../models/component.model';

interface ComponentResponse {
  active: ComponentModel[];
  archived: ComponentChangeModel[];
}

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  getComponents(): Observable<ComponentModel[]> {
    return this.http.get<ComponentModel[]>(`${environment.apiUrl}/components`);
  }

  getAllComponents(): Observable<ComponentResponse> {
    return this.http.get<ComponentResponse>(`${environment.apiUrl}/components/all`);
  }

  updateComponent(no: number, component: ComponentModel) {
    return this.http.put<ComponentModel>(`${environment.apiUrl}/components/${no}`, component, { withCredentials: true });
  }
  updateComponentPacking(no: number, component: ComponentModel) {
    return this.http.put<ComponentModel>(`${environment.apiUrl}/componentsPacking/${no}`, component, { withCredentials: true });
  }

  deleteComponent(no: string) {
    return this.http.delete(`${environment.apiUrl}/components/${no}`, { withCredentials: true });
  }

  addComponent(component: ComponentModel): Observable<ComponentModel> {
    return this.http.post<ComponentModel>(`${environment.apiUrl}/components`, component, { withCredentials: true });
  }
}
