import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComponentSapModel } from '../models/component.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentSapService {

  constructor(private http: HttpClient) { }

  getComponents(): Observable<ComponentSapModel[]> {
    return this.http.get<ComponentSapModel[]>(`${environment.apiUrl}/sap-components`);
  }
}
