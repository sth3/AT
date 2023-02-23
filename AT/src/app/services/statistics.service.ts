import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DoseModel } from '../models/statistics.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  getStatistics(type: number): Observable<DoseModel[]> {
    return this.http.get<DoseModel[]>(`${environment.apiUrl}/statistics/${type}`);
  }
  updateSelectStat( groupBy: Number[], type:Number): Observable<DoseModel[]>  {
    console.log('groupBy',groupBy,'type',type  );
    
    return this.http.post<DoseModel[]>(`${environment.apiUrl}/statistics/${type}/list`,groupBy,   { withCredentials: true });
  }
}
