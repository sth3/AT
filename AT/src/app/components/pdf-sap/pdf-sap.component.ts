import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';


import { OrderSapService  } from '../../services/order-sap.service';
import {
  CompliteOrdersModel, ComponentModel 
} from '../../models/order-sap.model';
import {  
  RecalculateOrder, selectList
} from '../../models/order.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-pdf-sap',
  templateUrl: './pdf-sap.component.html',
  styleUrls: ['./pdf-sap.component.css'],
  animations: [
    trigger('grow', [
      // Note the trigger name
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
export class PdfSapComponent implements OnInit {
  editable = true;
  isNew!: boolean;
  orderDueDate: string | undefined;
  recipe: string = '';
  order?: CompliteOrdersModel;
  orderComponent: ComponentModel [] = [];
  form!: FormGroup;

  quantityPallete: number = 0;
  quantityBag: number[] = [];
  quantityBigBag: number[] = [];
  quantityADS: number[] = [];
  quantityLiquid: number[] = [];
  quantityMicro: number[] = []; 
  quantityComponentPerOrder: number[] = [];
  recipeRecalculate: RecalculateOrder[] = [];  
  doneDose:number [] = [];
  weightPerDose: number = 0;
  volumePerDoseTank: number = 0;


  operator: UserModel | null = null;

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

  constructor(
    private router: Router,
    private r: ActivatedRoute,
    private ordersService: OrderSapService,   
    private changeDetectorRef: ChangeDetectorRef,   
  ) { this.prepareForm();    
    }

  ngOnInit(): void {
    this.r.params.subscribe((params) => {
      const no = params['id'];

      this.ordersService.getOrderSapAllByNo(no).subscribe((order) => {
        
        this.orderDueDate = order['dueDate'];
        this.editable = false;
        this.isNew = false;
        this.order = order;
        console.log("🚀 ~ file: pdf-sap.component.ts:50 ~ PdfSapComponent ~ this.ordersService.getOrderByNo ~ order:", order)
        this.orderComponent = this.order.components;        
        console.log("🚀 ~ file: pdf-sap.component.ts:52 ~ PdfSapComponent ~ this.ordersService.getOrderSapAllByNo ~ this.orderComponent :", this.orderComponent )
        
         this.quantityComponents(this.orderComponent);
         this.recipe = ` ${order.productID} - ${order.productName}` ;
         this.prepareForm();       

        this.changeDetectorRef.detectChanges();
      });
    });
  }

  quantityComponents(components: ComponentModel[]) {  
    if(this.order == null){      
      return
    }          
    this.quantityPallete = Math.ceil(components.reduce((acc, comp) => acc + ((comp.sp * (Number(this.order?.quantity) / 100)) / comp.specificBulkWeight), 0) / Number(this.order.volumePerDose));  
    this.volumePerDoseTank = Math.ceil(components.reduce((acc, comp) => acc + ((comp.sp * (Number(this.order?.quantity) / 100)) / comp.specificBulkWeight), 0)/this.quantityPallete );  
    this.quantityComponentPerOrder = components.map((comp) => (comp.sp * (Number(this.order?.quantity) / 100)));
    console.log('this.quantityComponentPerOrder',this.quantityComponentPerOrder);
    console.log('this.volumePerDoseTank',this.volumePerDoseTank);
    
       this.recalculateDose()
  }


  recalculateDose() {    
    this.quantityBag = [];
    this.quantityBigBag = [];
    this.quantityADS = [];
    this.quantityLiquid = [];
    this.quantityMicro = [];
    this.recipeRecalculate = [];
    if (this.orderComponent == null) {

      return;
    }
    for (let [index, volumeComponents] of this.orderComponent.entries()) {
      this.quantityBigBag[index] = 0;
      this.quantityADS[index] = 0;
      this.quantityBag[index] = 0;
      this.quantityMicro[index] = 0;
      this.quantityLiquid[index] = 0;   

      switch (this.order?.components[index].packingType) {
        case 0:
          this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packingWeight);
          this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete) - (volumeComponents.packingWeight * this.quantityBag[index]);
          break;
        case 1:
          this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete;
          break;
        case 2:
          this.quantityLiquid[index] = this.quantityComponentPerOrder[index] / this.quantityPallete ;
          break;
        case 3:
          this.quantityMicro[index] = this.quantityComponentPerOrder[index] / this.quantityPallete ;
          break;
      }

      this.recipeRecalculate.push({
        orderNo: 0,
        recipeNo: 0,
        componentNo: volumeComponents.componentRowID,
        quantityDose: this.quantityPallete,
        quantityBag: this.quantityBag[index],
        quantityBigBag: this.quantityBigBag[index],
        quantityADS: this.quantityADS[index],
        quantityLiquid: this.quantityLiquid[index],
        quantityMicro: this.quantityMicro[index],

        
      })

    }
    console.log('quantityBag', this.quantityBag);
    console.log('quantityADS', this.quantityADS);
    console.log('quantityBigBag', this.quantityBigBag);
    console.log('quantityLiquid', this.quantityLiquid);
    console.log('quantityMicro', this.quantityMicro);
    this.weightPerDose = this.quantityComponentPerOrder.reduce((acc, comp)=>(acc + comp) ) / this.quantityPallete;
    this.doneDose[0] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityBigBag,0) > 0 ? 0 :5;
    this.doneDose[1] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityLiquid,0) > 0 ? 0 :5;
    this.doneDose[2] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityADS,0) > 0 ? 0 :5;
    this.doneDose[3] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityMicro,0) > 0 ? 0 :5;

    console.log('doneDose',this.doneDose);

    

  }

  private prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.order?.orderID || '', [
        Validators.required,
      ]),
      name: new FormControl(this.order?.segmentRequirementID || '', [
        Validators.required,        
      ]),
      customerName: new FormControl(
        this.order?.customerName || '',
        Validators.required
      ),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      
      quantity: new FormControl(
        this.order?.quantity.toFixed(3) || null ,
        Validators.required
      ),
      idMixer: new FormControl(this.order?.idMixer, Validators.required),
      mixingTime: new FormControl(
        this.order?.mixingTime || null,
        Validators.required
      ),
      idPackingMachine: new FormControl(
        this.order?.idPackingMachine,
        Validators.required
      ),
      idEmptyingStationBag: new FormControl(
        this.order?.idEmptyingStationBag,
        Validators.required
      ),
      volumePerDose: new FormControl(this.order?.volumePerDose, Validators.required),
      operatorId: new FormControl(this.order?.operator.id || '001'),
      // todo get real used id/name here
      operatorName: new FormControl(this.order?.operator.firstName + ' '+ this.order?.operator.lastName || ''
        
      ),
    });
  }

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r });
  }

}
