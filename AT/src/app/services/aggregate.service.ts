import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AggregateModel } from '../models/agreggate.model';
@Injectable({
  providedIn: 'root'
})
export class AggregateService {

  constructor(private http: HttpClient) { }

  
  getAggregates(type: number): Observable<AggregateModel[]> {
    return this.http.get<AggregateModel[]>(`${environment.apiUrl}/aggregates/${type}`)
  }
  
}
