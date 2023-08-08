import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable, startWith } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';
import { OrderSapService } from '../../services/order-sap.service';
import { OrdersService } from '../../services/orders.service';
import { DialogService } from '../../services/dialog.service';
import { NotifierService } from '../../services/notifier.service';

import { OrderModel, ComponentModel, ProductionDoneSapModel , RecalculateOrderSapModel, CompliteOrderModel} from '../../models/order-sap.model';
import { RecalculateOrder } from '../../models/order.model';
import { UserModel } from '../../models/user.model';

import { RecalculateSapComponent } from '../recalculate-sap/recalculate-sap.component';
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
  order?: OrderModel;
  form!: FormGroup;
  packingForm!: FormGroup;
  components: ComponentModel[] = [];
  operator: UserModel | null = null;
  dosePerOrder: RecalculateOrderSapModel = {
    orderRowID: 0,
    segmentRequirementID: '',
    componentRowID: 0,
    packingType: 0,
    packingWeight: 0,
    quantityDose: 0,
    quantityBag: 0,
    quantityBigBag: 0,
    quantityADS: 0,
    quantityLiquid: 0,
    quantityMicro: 0
  };
  compliteOrder: CompliteOrderModel = {
    ADSDone: 0,
  BigBagDone: 0, 
  LiquidDone: 0,
  MicroDone: 0,
  done: 0,

  idEmptyingStationBag: 0,
  idMixer: 0,
  idPackingMachine: 0,
  mixingTime: 0,

  orderID: '',
  orderRowID: 0,
  package: 0,
  packingOrders: [{
    packingType: 0,
    packingWeight:0,}
  ],
  productID: '',
  productName: '',
  quantity: 0,
  recipeRowID: 0,

  volumePerDose: 0,
  //operator: UserModel;
  rec: {
    orderRowID: 0,
    segmentRequirementID: '',
    componentRowID: 0,
    packingType: 0,
    packingWeight: 0,
    quantityDose: 0,
    quantityBag: 0,
    quantityBigBag: 0,
    quantityADS: 0,
    quantityLiquid: 0,
    quantityMicro: 0
  },
  segmentRequirementID: '',
  componentRowID: 0, 
  };
  //compliteOrder?: CompliteOrderModel ;
  donePerStation?: ProductionDoneSapModel;

  constructor(
    private r: ActivatedRoute,
    private router: Router,
    private orderSapService: OrderSapService,
    private ordersService: OrdersService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private auth: AuthService
  ) {
    this.prepareForm();
    this.auth.user$.subscribe((user) => {
      this.operator = user;
      this.form.patchValue({
        operatorId: user?.id || null,
        operatorName: this.ordersService.showFullUserName(user as UserModel),
      });
    });
  }

  ngOnInit(): void {
    this.r.params.subscribe((params) => {
      const no = params['id'];

      this.orderSapService.getOrderByNo(no).subscribe((order: OrderModel) => {
        console.log(
          '🚀 ~ file: order-detail-sap.component.ts:46 ~ OrderDetailSapComponent ~ this.orderSapService.getOrderByNo ~ order:',
          order
        );
        this.order = order;

        this.components = order.components;
        this.prepareForm();

        console.log(
          '🚀 ~ file: order-detail-sap.component.ts:55 ~ OrderDetailSapComponent ~ prepareForm ~ this.order?.recipeRowID:',
          this.order.recipeRowID
        );
        //console.log("🚀 ~ file: order-detail-sap.component.ts:53 ~ OrderDetailSapComponent ~ prepareForm ~ this.form:", this.form)
        console.log(
          '🚀 ~ file: order-detail-sap.component.ts:36 ~ OrderDetailSapComponent ~ this.orderSapService.getOrderByNo ~ this.order:',
          this.order
        );
        this.addRowFromArray();
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  addRowFromArray() {
    this.packingOrders.controls = [];

    if (this.order == null) {
      return;
    }

    for (let [index, components] of this.order.components.entries()) {
      this.packingForm = new FormGroup({
        packingType: new FormControl(
          components.packingType,
          // this.components[index].packingType,
          Validators.required
        ),
        packingWeight: new FormControl(
          components.packingWeight,
          //this.components[index].packingWeight,
          Validators.required
        ),
      });
      this.packingOrders.push(this.packingForm);

      //this.packingOrders.controls [index].get('packingType')?.disable({onlySelf: true})
    }

    console.log('this.formr', this.form);
  }

  get recipeRowID() {
    return this.form.get('recipeRowID') as FormControl;
  }
  get orderID() {
    return this.form.get('orderID') as FormControl;
  }
  get segmentRequirementID() {
    return this.form.get('segmentRequirementID') as FormControl;
  }
  get productID() {
    return this.form.get('productID') as FormControl;
  }
  get productName() {
    return this.form.get('productName') as FormControl;
  }
  get quantity() {
    return this.form.get('quantity') as FormControl;
  }
  get packingOrders() {
    return this.form.controls['packingOrders'] as FormArray;
  }

  get idPackingMachine() {
    return this.form.get('idPackingMachine') as FormControl;
  }

  get idEmptyingStationBag() {
    return this.form.get('idEmptyingStationBag') as FormControl;
  }

  get idMixer() {
    return this.form.get('idMixer') as FormControl;
  }

  get package() {
    return this.form.get('package') as FormControl;
  }

  get volumePerDose() {
    return this.form.get('volumePerDose') as FormControl;
  }

  private prepareForm() {
    this.form = new FormGroup({
      recipeRowID: new FormControl(this.order?.recipeRowID || '', [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(22),
      ]),
      orderID: new FormControl(this.order?.orderID || '', [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(22),
      ]),
      segmentRequirementID: new FormControl(
        this.order?.segmentRequirementID || '',
        [Validators.minLength(1), Validators.required, Validators.maxLength(22)]
      ),
      productID: new FormControl(this.order?.productID || '', [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(22),
      ]),
      productName: new FormControl(this.order?.productName || '', [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(40),
      ]),
      quantity: new FormControl(
        this.order?.quantity || null,
        Validators.required
      ),
      packingOrders: new FormArray([]),
      idMixer: new FormControl(null, [Validators.required, Validators.min(1)]),
      package: new FormControl(1, [Validators.required, Validators.min(1)]),
      mixingTime: new FormControl(null, Validators.required),
      idPackingMachine: new FormControl(null, Validators.required),
      idEmptyingStationBag: new FormControl(null, Validators.required),
      volumePerDose: new FormControl(0, [
        Validators.required,
        Validators.min(50),
        Validators.max(700),
      ]),
    });
  }

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r });
  }

  recalculateRecipe() {
    this.translate.get('dialogService').subscribe((successMessage) => {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        //this.recipeSelect?.ngControl?.control?.markAsTouched();
        this.notifier.showNotification(
          successMessage.notifierErrordescription,
          successMessage.close,
          successMessage.error
        );
        return;
      }

      console.log('save me ', this.form.value);
      console.log('components recipe: ', this.components);

      this.dialogService
        .customDialog(
          RecalculateSapComponent,
          {
            orderSap: this.form.value,
            orderSapComponents: this.components,
            dueDate: this.order?.dueDate,
          },
          { width: '1455px', height: 'auto' }
        )
        .subscribe((result) => {
          if (result == null) {
            return;
          }

          if (result.edit) {
            this.dosePerOrder = result.data;
            console.log("🚀 ~ file: order-detail-sap.component.ts:246 ~ OrderDetailSapComponent ~ .subscribe ~ this.dosePerOrder:", this.dosePerOrder)
            this.donePerStation = result.done;
            console.log("🚀 ~ file: order-detail-sap.component.ts:248 ~ OrderDetailSapComponent ~ .subscribe ~ this.donePerStation:", this.donePerStation)
            
            if (this.form.pristine) {
              return;
            }
            this.saveOrder();
          }
        });
    });
  }

  saveOrder() {
    console.log("🚀 ~ file: order-detail-sap.component.ts:261 ~ OrderDetailSapComponent ~ this.translate.get ~ successMessage:", 'here2')
    this.translate.get('dialogService').subscribe((successMessage) => {
      if (this.form.pristine) {
        return;
      }

      
      
      //this.compliteOrder =  {...this.donePerStation , ... this.form.value  };
      this.compliteOrder =    {...this.form.value, ...this.donePerStation};

      if (this.compliteOrder == null || this.dosePerOrder == null) {
        return;
      }
      this.compliteOrder.rec = this.dosePerOrder;
      console.log("🚀 ~ file: order-detail-sap.component.ts:288 ~ OrderDetailSapComponent ~ .subscribe ~ this.dosePerOrder:", this.dosePerOrder)
      console.log("🚀 ~ file: order-detail-sap.component.ts:288 ~ OrderDetailSapComponent ~ .subscribe ~ this.dosePerOrder:", this.compliteOrder.packingOrders[0].packingType)
      this.dialogService
      .confirmDialog(successMessage.dialogOrderCreate)
      .subscribe((result) => {
        if (result) {
            console.log("🚀 ~ file: order-detail-sap.component.ts:288 ~ OrderDetailSapComponent ~ .subscribe ~ this.dosePerOrder:", this.compliteOrder)
            this.orderSapService
              .addOrder(this.compliteOrder)
              .subscribe((order) => {
                console.log('new order: ', order);
                this.router.navigate(['/orders-sap', order.orderRowID]);
              });
          }
        });
    });
  }
}
