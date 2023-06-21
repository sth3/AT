import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderSapService } from '../../services/order-sap.service';
@Component({
  selector: 'app-order-detail-sap',
  templateUrl: './order-detail-sap.component.html',
  styleUrls: ['./order-detail-sap.component.css'],
  animations: [
    trigger('grow', [
      transition(':enter', [
        style({ height: '0', overflow: 'hidden' }),
        animate(500, style({ height: '*' })),
      ]),
      transition(':leave', [
        animate(500, style({ height: 0, overflow: 'hidden' })),
      ]),
    ]),
  ],
})
export class OrderDetailSapComponent implements OnInit {

  constructor(
    private r: ActivatedRoute,
    private orderSapService: OrderSapService,
  ) { }

  ngOnInit(): void {
    this.r.params.subscribe((params) => {
      const no = params['id'];
      console.log("🚀 ~ file: order-detail-sap.component.ts:29 ~ OrderDetailSapComponent ~ this.r.params.subscribe ~ no:", no)
      console.log("🚀 ~ file: order-detail-sap.component.ts:29 ~ OrderDetailSapComponent ~ this.r.params.subscribe ~ params:", params)
      this.orderSapService.getOrderByNo(no).subscribe((order) => {
        
        console.log("🚀 ~ file: order-detail-sap.component.ts:37 ~ OrderDetailSapComponent ~ this.ordersService.getOrderByNo ~ order:", order)
      });
  });
}

}
