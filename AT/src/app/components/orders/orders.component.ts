import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { OrderModel } from '../../models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogService } from '../../services/dialog.service';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';
import { finalize } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersComponent implements OnInit {

  orders: OrderModel[] = [];
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
  isLoading = true;
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field), 'actions'];
  expandedOrder: OrderModel | null = null;
  dataSource: MatTableDataSource<OrderModel> = new MatTableDataSource<OrderModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ordersService: OrdersService,
              private dialogService: DialogService,
              private exportService: ExportService,
              private notifierService: NotifierService,
              private router: Router, private r: ActivatedRoute,
              private dateAdapter: DateAdapter<Date>) {
                this.dateAdapter.setLocale('en-GB'); }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.ordersService.getOrders()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
      (data: OrderModel[]) => {
        this.orders = data;
        console.log(this.orders);
        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.orders = data.filter((item: OrderModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return new Date(item.lastUpdate) >= this.range.value.start &&
              new Date(item.lastUpdate) <= this.range.value.end;
          });
        } else if (this.range.value.start !== null) {
          this.orders = data.filter((item: OrderModel) => {
            return new Date(item.lastUpdate) >= this.range.value.start ;
          });
        } else if (this.range.value.end !== null) {
          this.orders = data.filter((item: OrderModel) => {
            return new Date(item.lastUpdate) <= this.range.value.end ;
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

  onDeleteClick(data: any) {
    this.dialogService.confirmDialog('Are you sure you want to delete this order?')
      .subscribe(result => {
        if (result) {
          this.ordersService.deleteOrder(data.no)
            .subscribe(() => {
              console.log('order deleted: ', data);
              this.notifierService.showDefaultNotification('Order deleted');
              this.orders = this.orders.filter(o => o.no !== data.no);
              this.dataSource.data = this.orders;
            })
        }
      })
  }

  onEditClick(data: any) {
    this.router.navigate([data.no], { relativeTo: this.r })
  }

  createOrder() {
    this.router.navigate(['new'], { relativeTo: this.r })
  }

  pdfClick(data: any) {
    this.router.navigate(['../pdf/'+data.no], { relativeTo: this.r })
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = this.exportService.getOrdersHeaders();
    let data;
    if (visibleDataOnly) {
      // @ts-ignore
      data = this.exportService.convertOrdersForDownload(this.dataSource._renderData.value);
    } else {
      data = this.exportService.convertOrdersForDownload(this.orders);
    }
    this.exportService.downloadFile(data, headerList, 'orders');
  }
}
