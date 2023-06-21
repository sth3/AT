import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {  OrderModel } from '../models/order-sap.model';
@Injectable({
  providedIn: 'root'
})
export class OrderSapService {

  constructor(private http: HttpClient) { }

  getOrdersSAP(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${environment.apiUrl}/orders-sap/0`);
  }

  getOrderByNo(no: any) {
    return this.http.get<OrderModel>(`${environment.apiUrl}/orders-sap/0/${no}`);
  }
}
