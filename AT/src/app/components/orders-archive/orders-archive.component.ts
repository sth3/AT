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
import {  OrderSapModel, CompliteOrdersModel } from '../../models/order-sap.model';
import { OrdersService } from '../../services/orders.service';
import { OrderSapService } from '../../services/order-sap.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from '../../services/export.service';
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
  ordersSap: CompliteOrdersModel[] = [];
  expandedOrder: OrderModel | null = null;
  isLoading: Boolean = true;

  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  type: number = 0;
  

  columnsToDisplay = [
    { field: 'no', header: 'No' },
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Order name' },
    { field: 'customerName', header: 'Customer name' },
    { field: 'dueDate', header: 'Due date', width: '20%' },
  ];
  columnsToDisplayWithExpand = [
    'expand',
    ...this.columnsToDisplay.map((c) => c.field), 'actions',
  ];
  dataSource: MatTableDataSource<OrderModel> =
    new MatTableDataSource<OrderModel>([]);
    dataSourceSap: MatTableDataSource<CompliteOrdersModel> =
    new MatTableDataSource<CompliteOrdersModel>([]);
 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ordersService: OrdersService,
    private exportService: ExportService,
    private router: Router, private r: ActivatedRoute,
    private orderSapService: OrderSapService,
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
  
  getOrdersSap() {
    
    this.isLoading = true;
    this.orderSapService
      .getOrdersSapAllDone()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: CompliteOrdersModel[]) => {
        this.ordersSap = data;

        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.ordersSap = data.filter((item: CompliteOrdersModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return (
              new Date(item.timeStampWrite) >= this.range.value.start &&
              new Date(item.timeStampWrite) <= this.range.value.end
            );
          });
        } else if (this.range.value.start !== null) {
          this.ordersSap = data.filter((item: CompliteOrdersModel) => {
            return new Date(item.timeStampWrite) >= this.range.value.start;
          });
        } else if (this.range.value.end !== null) {
          this.ordersSap = data.filter((item: CompliteOrdersModel) => {
            return new Date(item.timeStampWrite) <= this.range.value.end;
          });
        }



        this.dataSourceSap = new MatTableDataSource<CompliteOrdersModel>(this.ordersSap);
          this.dataSourceSap.paginator = this.paginator;
          this.dataSourceSap.sort = this.sort;
        console.log('getOrders', data);
      });
  }


  setTable(){
    if (this.type) {
      this.columnsToDisplay = [
        { field: 'recipeRowID', header: 'No' },
        { field: 'orderID', header: 'Order ID' },
        { field: 'segmentRequirementID', header: 'Segment Requirement ID' },
        { field: 'productID', header: 'Recipe ID' },
        { field: 'productName', header: 'Recipe name' },
        { field: 'dueDate', header: 'Due date', width: '20%' },
        { field: 'timeStampWrite', header: 'Due date', width: '20%' },
      ];
      this.columnsToDisplayWithExpand = [
        'expand',
        ...this.columnsToDisplay.map((c) => c.field),
        'actions',
      ];
      this.getOrdersSap()

    } else {
      this.columnsToDisplay = [
        { field: 'no', header: 'No' },
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Order name' },
        { field: 'customerName', header: 'Customer name' },
        { field: 'dueDate', header: 'Due date', width: '20%' },
        
      ];
      this.columnsToDisplayWithExpand = [
        'expand',
        ...this.columnsToDisplay.map((c) => c.field),
        'actions',
      ];

      this.getOrders()
    }
  }


  changeTypeOfOrder() {
    console.log(
      '🚀 ~ file: orders.component.ts:35 ~ OrdersComponent ~ type:',
      this.type
    );

    this.setTable() 
        
            
  }

  pdfClickSAP(data: any) {
    this.router.navigate(['../pdf-sap/' + data.orderRowID], { relativeTo: this.r });
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onEditClick(data: any) {
    this.router.navigate([`../pdf/${data.no}`], { relativeTo: this.r })
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = this.exportService.getOrdersHeaders();
    let data;
    //if (visibleDataOnly) {
      // @ts-ignore
      data = this.exportService.convertOrdersForDownload(this.dataSource._renderData.value);
    //} else {
    //  console.log(this.orders);
      
     // data = this.exportService.convertOrdersForDownload(this.orders);
    //  console.log('data',data);
   // }
    this.exportService.downloadFile(data, headerList, 'archiveOrders');
  }
  
}
