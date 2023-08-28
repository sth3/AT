import { Component, ElementRef, OnInit, ViewChild, Input  } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import {
  OrderModel,
  OrderModelPacking,
  selectList,
  TypeOfOrderModel
} from '../../models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogService } from '../../services/dialog.service';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';
import { finalize } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserModel, UserRole } from '../../models/user.model';

import { OrderSapService } from '../../services/order-sap.service';
import {  OrderSapModel, CompliteOrdersModel } from '../../models/order-sap.model';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
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
export class OrdersComponent implements OnInit {

  //@Input() setType: number;
  type: number = 0;
  setType: number = 0;

  orders: OrderModelPacking[] = [];
  ordersSap: CompliteOrdersModel[] = [];
  currentUser!: UserModel;
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

  isLoading = true;
  columnsToDisplayWithExpand = [
    'expand',
    ...this.columnsToDisplay.map((c) => c.field),
    'actions',
  ];
  expandedOrder: OrderModel | null = null;
  dataSource: MatTableDataSource<OrderModel> =
    new MatTableDataSource<OrderModel>([]);
  dataSourceSap: MatTableDataSource<CompliteOrdersModel> =
    new MatTableDataSource<CompliteOrdersModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('myInput')
  myInput!: ElementRef;
  constructor(
    private ordersService: OrdersService,
    private dialogService: DialogService,
    private exportService: ExportService,
    private notifierService: NotifierService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private r: ActivatedRoute,
    private orderSapService: OrderSapService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.getTypeOrders();
   //this.getOrders();
  }
  getTypeOrders() {
    this.ordersService
      .getTypeOrders()
      .subscribe((data: TypeOfOrderModel) => {
        this.type = data.typeOfOrder;
        this.setType = data.typeOfOrder;

        this.setTable()
        console.log('getTypeOrders', data);        
      });
  }
  getOrders() {
    this.isLoading = true;
    this.ordersService
      .getOrders(0)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: OrderModelPacking[]) => {
        this.orders = data;
        console.log('getOrders', data);
        console.log(
          'columnsToDisplayWithExpand',
          this.columnsToDisplayWithExpand
        );
        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.orders = data.filter((item: OrderModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
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
    console.log('columnsToDisplayWithExpand', this.columnsToDisplayWithExpand);
  }

  getOrdersSap() {
    
    this.isLoading = true;
    this.orderSapService
      .getOrdersSapAll()
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

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onDeleteClick(data: any) {
    this.translate.get('dialogService').subscribe((successMessage) => {
      this.dialogService
        .confirmDialog(successMessage.dialogOrderDelete)
        .subscribe((result) => {
          if (result) {
            this.ordersService.deleteOrder(data.no).subscribe(() => {
              console.log('order deleted: ', data);
              this.notifierService.showDefaultNotification(
                successMessage.notifierOrderDeleted
              );
              this.orders = this.orders.filter((o) => o.no !== data.no);
              this.dataSource.data = this.orders;
            });
          }
        });
    });
  }

  onEditClick(data: any) {
    this.router.navigate([data.no], { relativeTo: this.r });
  }

  createOrder() {
    this.authService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
      if (this.currentUser !== null) {
        if (
          this.currentUser.role === 'ADMIN' ||
          this.currentUser.role === 'TECHNOLOG'
        ) {
          if (this.type === 0) {
            this.router.navigate(['new'], { relativeTo: this.r });
            return;
          }
          this.router.navigate(['/orders-sap']);
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    });
  }

  changeTypeOfOrder() {
    console.log(
      '🚀 ~ file: orders.component.ts:35 ~ OrdersComponent ~ type:',
      this.type
    );

    this.setTable()

    if (this.setType != this.type) {
      this.translate.get('dialogService').subscribe((successMessage) => {
        this.dialogService
          .confirmDialog(successMessage.dialogTypeOfOrder)
          .subscribe((result) => {
            if (result) {
              this.authService.getCurrentUser().subscribe((data) => {
                this.currentUser = data;
                if (this.currentUser !== null) {
                  if (
                    this.currentUser.role === 'ADMIN' ||
                    this.currentUser.role === 'TECHNOLOG'
                  ) {
                    console.log(
                      '🚀 ~ file: orders.component.ts:182 ~ OrdersComponent ~ this.authService.getCurrentUser ~ this.currentUser.role:',
                      this.currentUser.id
                    );
                    this.ordersService
                      .addTypeOfOrder({
                        typeOfOrder: this.type,
                        userRowID: this.currentUser.id,
                      })
                      .subscribe((resultTypeOfOrder) => {
                        console.log('new Type: ', resultTypeOfOrder.typeOfOrder);
                        this.setType = resultTypeOfOrder.typeOfOrder;
                        this.notifierService.showDefaultNotification(successMessage.notifierUpdate);
                        
                      });
                  } else {
                    if(this.type){ this.type = 0}else{ this.type = 1}
                    this.authService.promptLogin('Login');
                    return;
                  }
                } else {
                   if(this.type){ this.type = 0}else{ this.type = 1}
                  this.authService.promptLogin('Login');
                  return;
                }
              });
            }
            console.log(
              '🚀 ~ file: orders.component.ts:178 ~ OrdersComponent ~ .subscribe ~ result:',
              result
            );
          });
      });

      
      
    }
    // this.authService.getCurrentUser().subscribe(data => {
    //   this.currentUser = data;
    //   if (this.currentUser !== null) {
    //     if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
    //       this.router.navigate(['/orders-sap']);
    //     } else {
    //       this.authService.promptLogin('Login');
    //       return;
    //     }
    //   } else {
    //     this.authService.promptLogin('Login');
    //     return;
    //   }
    // })
  }

  

  pdfClick(data: any) {
    this.router.navigate(['../pdf/' + data.no], { relativeTo: this.r });
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = this.exportService.getOrdersHeaders();
    let data;
    if (visibleDataOnly) {
      // @ts-ignore
      data = this.exportService.convertOrdersForDownload(this.dataSource._renderData.value);
    } else {
      console.log(this.orders);

      data = this.exportService.convertOrdersForDownload(this.orders);
      console.log('data', data);
    }
    this.exportService.downloadFile(data, headerList, 'orders');
  }
}
