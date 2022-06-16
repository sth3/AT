import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

    constructor(private http: HttpClient) { }

    getOrders(): Observable<OrderModel[]> {
        return this.http.get<OrderModel[]>(`${environment.apiUrl}/orders`);
    }

    deleteOrder(no: string) {
      return this.http.delete(`${environment.apiUrl}/orders/${no}`);
    }

    addOrder(order: OrderModel): Observable<OrderModel> {
      return this.http.post<OrderModel>(`${environment.apiUrl}/orders`, order);
    }

    updateOrder(no: number, order: OrderModel) {
      return this.http.put<OrderModel>(`${environment.apiUrl}/orders/${no}`, order);
    }
}
