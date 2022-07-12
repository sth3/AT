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

  getDoseStatistics(): Observable<DoseModel[]> {
    return this.http.get<DoseModel[]>(`${environment.apiUrl}/dose-statistics`);
  }
}
