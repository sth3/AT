import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import { OrderSapService } from '../../services/order-sap.service';

import { OrderModel } from '../../models/order-sap.model';
@Component({
  selector: 'app-order-sap',
  templateUrl: './order-sap.component.html',
  styleUrls: ['./order-sap.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderSapComponent implements OnInit {

  columnsToDisplay = [
    { field: 'recipeRowID', header: 'No' },
    { field: 'orderID', header: 'Order ID' },
    { field: 'segmentRequirementID', header: 'Segment Requirement ID' },
    { field: 'productID', header: 'Recipe ID' },
    { field: 'productName', header: 'Recipe name' },
    { field: 'dueDate', header: 'Due date', width: '20%' },
    { field: 'timeStampWrite', header: 'Due date', width: '20%' },
  ];

  isLoading: boolean = true;
  orders: OrderModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field), 'actions'];
  expandedOrder: OrderModel | null = null;
  dataSource: MatTableDataSource<OrderModel> = new MatTableDataSource<OrderModel>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderSapService: OrderSapService,
    private router: Router, private r: ActivatedRoute,) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.orderSapService
      .getOrdersSAP()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: OrderModel[]) => {
        this.orders = data;
        this.dataSource = new MatTableDataSource<OrderModel>(this.orders);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        console.log('getOrders', data);
      });
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onEditClick(data: any) {
    console.log("🚀 ~ file: order-sap.component.ts:80 ~ OrderSapComponent ~ onEditClick ~ data:", data.recipeRowID)
    
    this.router.navigate([data.recipeRowID], { relativeTo: this.r })
   // this.router.navigate([data.recipeRowID, { idDB: 1 }], { relativeTo: this.r })
  }
}
