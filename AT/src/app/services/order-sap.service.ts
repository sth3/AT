import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {  OrderModel,  RecalculateOrderSapModel, CompliteOrderModel } from '../models/order-sap.model';
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

  addOrder(order: CompliteOrderModel ): Observable<CompliteOrderModel> {    
    return this.http.post<CompliteOrderModel>(`${environment.apiUrl}/orders-sap/0`, order ,  { withCredentials: true });
  }
}
