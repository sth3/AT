import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {  OrderSapModel,  RecalculateOrderSapModel, CompliteOrderModel, CompliteOrdersModel } from '../models/order-sap.model';
@Injectable({
  providedIn: 'root'
})
export class OrderSapService {

  constructor(private http: HttpClient) { }

  getOrdersSAP(): Observable<OrderSapModel[]> {
    return this.http.get<OrderSapModel[]>(`${environment.apiUrl}/orders-sap/0`);
  }
  getOrdersSapAll(): Observable<CompliteOrdersModel[]> {
    return this.http.get<CompliteOrdersModel[]>(`${environment.apiUrl}/orders-sap/1`);
  }
  getOrdersSapAllDone(): Observable<CompliteOrdersModel[]> {
    return this.http.get<CompliteOrdersModel[]>(`${environment.apiUrl}/orders-sap/2`);
  }
  getOrderSapAllByNo(no: any): Observable<CompliteOrdersModel> {
    return this.http.get<CompliteOrdersModel>(`${environment.apiUrl}/orders-sap/1/${no}`);
  }

  getOrderByNo(no: any) {
    return this.http.get<OrderSapModel>(`${environment.apiUrl}/orders-sap/0/${no}`);
  }

  addOrder(order: CompliteOrderModel ): Observable<CompliteOrderModel> {    
    return this.http.post<CompliteOrderModel>(`${environment.apiUrl}/orders-sap/0`, order ,  { withCredentials: true });
  }
}
