import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateAdapter } from '@angular/material/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { finalize } from 'rxjs';

import { OrderModel, selectList } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-archive',
  templateUrl: './orders-archive.component.html',
  styleUrls: ['./orders-archive.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OrdersArchiveComponent implements OnInit  {
  orders: OrderModel[] = [];
  expandedOrder: OrderModel | null = null;
  isLoading: Boolean = true;

  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  columnsToDisplay = [
    { field: 'no', header: 'No' },
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Order name' },
    { field: 'customerName', header: 'Customer name' },
    { field: 'dueDate', header: 'Due date', width: '20%' },
  ];
  columnsToDisplayWithExpand = [
    'expand',
    ...this.columnsToDisplay.map((c) => c.field),
  ];
  dataSource: MatTableDataSource<OrderModel> =
    new MatTableDataSource<OrderModel>([]);

  slecetIdMixers: selectList[] = [
    { value: 1, viewValue: 'Vertical mixer' },
    { value: 2, viewValue: 'Horizontal mixer' },
    { value: 3, viewValue: 'External mixer' },
  ];

  packingOrders: selectList[] = [
    { value: 0, viewValue: 'Bag' },
    { value: 1, viewValue: 'Big Bag' },
    { value: 2, viewValue: 'Liquid' },
    { value: 3, viewValue: 'Micro' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ordersService: OrdersService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.ordersService
      .getOrders(1)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: OrderModel[]) => {
        this.orders = data;
        console.log(this.orders);
        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.orders = data.filter((item: OrderModel) => {
            return (
              new Date(item.lastUpdate) >= this.range.value.start &&
              new Date(item.lastUpdate) <= this.range.value.end
            );
          });
        } else if (this.range.value.start !== null) {
          this.orders = data.filter((item: OrderModel) => {
            return new Date(item.lastUpdate) >= this.range.value.start;
          });
        } else if (this.range.value.end !== null) {
          this.orders = data.filter((item: OrderModel) => {
            return new Date(item.lastUpdate) <= this.range.value.end;
          });
        }

        this.dataSource = new MatTableDataSource<OrderModel>(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }


  
}
