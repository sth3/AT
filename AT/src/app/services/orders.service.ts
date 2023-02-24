import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrderListModel, OrderModel, OrderModelPacking } from '../models/order.model';
import { UserModel } from '../models/user.model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {
  }

  getOrders(done: number): Observable<OrderModelPacking[]> {
    return this.http.get<OrderModelPacking[]>(`${environment.apiUrl}/orders/${done}`);
  }

  deleteOrder(no: number) {
    return this.http.delete(`${environment.apiUrl}/orders/0/${no}`, { withCredentials: true });
  }

  addOrder(order: OrderModel ): Observable<OrderModel> {
    order.dueDate = formatDate(new Date(order.dueDate), 'yyyy-MM-dd', 'en-GB');
    return this.http.post<OrderModel>(`${environment.apiUrl}/orders/0`, order,  { withCredentials: true });
  }
 

  updateOrder(no: number, order: OrderModel) {
    order.dueDate = formatDate(new Date(order.dueDate), 'yyyy-MM-dd', 'en-GB');
    return this.http.put<OrderModel>(`${environment.apiUrl}/orders/0/${no}`,order,    { withCredentials: true });
  }

  getOrderByNo(no: any) {
    return this.http.get<OrderModel>(`${environment.apiUrl}/orders/0/${no}`);
  }

  getOrdersList(): Observable<OrderListModel[]> {
    return this.http.get<OrderListModel[]>(`${environment.apiUrl}/orders/0/list`);
  }

  showFullUserName(user: UserModel): string {
    if (!user) {
      return '';
    }
    return `${user.firstName} ${user.lastName}`;
  }
}
