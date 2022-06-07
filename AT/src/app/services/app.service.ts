import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor( public httpClient: HttpClient) { }

  getDeals(): Observable<any> {
   return this.httpClient.get('http://localhost:3000/deals');
    
  }
}
