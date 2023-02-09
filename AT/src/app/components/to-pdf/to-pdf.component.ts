import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgModule,
} from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { OrdersService  } from '../../services/orders.service';
import { RecipeService } from '../../services/recipe.service';
import {
  OrderListModel,
  OrderModel,
  selectList,
  OrderModelPacking,
  RecalculateOrder
} from '../../models/order.model';
import { RecipeModel } from '../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';

import { animate, style, transition, trigger } from '@angular/animations';
import { ComponentItemModel, ComponentModelSP } from 'src/app/models/component.model';


@Component({
  selector: 'app-to-pdf',
  templateUrl: './to-pdf.component.html',
  styleUrls: ['./to-pdf.component.css'],
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
export class ToPDFComponent implements OnInit {
  editable = true;
  isNew!: boolean;
  order?: OrderModel;
  recipes: RecipeModel[] = [];
  allOrders: OrderListModel[] = [];
  selectedRecipe: RecipeModel | undefined;
  recipe: string = '';
  orderDueDate: string | undefined;
  orderComponent: ComponentItemModel [] = [];
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
    private ordersService: OrdersService,
    private recipeService: RecipeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.r.params.subscribe((params) => {
      const no = params['id'];

      this.ordersService.getOrderByNo(no).subscribe((order) => {
        
        this.orderDueDate = order['dueDate'];
        this.editable = false;
        this.isNew = false;
        this.order = order;
        this.orderComponent = this.order.recipe.components;        
        
        this.quantityComponents(this.orderComponent);
        this.recipe = ` ${this.order.recipe.id.trim()} - ${this.order.recipe.name.trim()}` ;
        this.prepareForm();       

        this.changeDetectorRef.detectChanges();
      });
    });
    
  }

  quantityComponents(components: ComponentModelSP[]) {  
    if(this.order == null){      
      return
    }          
    this.quantityPallete = Math.ceil(components.reduce((acc, comp) => acc + ((comp.componentSP * (Number(this.order?.quantity) / 100)) / comp.specificBulkWeight), 0) / Number(this.order.volumePerDose));  
    this.quantityComponentPerOrder = components.map((comp) => (comp.componentSP * (Number(this.order?.quantity) / 100)));
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

      switch (this.order?.recipe.components[index].packingOrder) {
        case 0:
          this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing);
          this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete) - (volumeComponents.packing * this.quantityBag[index]);
          break;
        case 1:
          this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
          break;
        case 2:
          this.quantityLiquid[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
          break;
        case 3:
          this.quantityMicro[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
          break;
      }

      this.recipeRecalculate.push({
        orderNo: 0,
        recipeNo: 0,
        componentNo: volumeComponents.no,
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
      id: new FormControl(this.order?.id || '', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      name: new FormControl(this.order?.name || '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      customerName: new FormControl(
        this.order?.customerName || '',
        Validators.required
      ),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      recipeNo: new FormControl(
        this.order?.recipe.no || '',
        Validators.required
      ),
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
      operatorName: new FormControl(this.order?.operator.username || 'admin'),
    });
  }

  

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r });
  }
}
