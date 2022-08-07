import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangedComponentModel, ComponentModel } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ComponentResponse {
  active: ComponentModel[];
  archived: ChangedComponentModel[];
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

  deleteComponent(no: string) {
    return this.http.delete(`${environment.apiUrl}/components/${no}`, { withCredentials: true });
  }

  addComponent(component: ComponentModel): Observable<ComponentModel> {
    return this.http.post<ComponentModel>(`${environment.apiUrl}/components`, component, { withCredentials: true });
  }
}
