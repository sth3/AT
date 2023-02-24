import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import {
  OrderListModel,
  OrderModel,
  OrderModelPacking,
  OrderPacking,
  selectList,
  RecalculateOrder,
  PackingInterface,
} from '../../models/order.model';
import { ComponentModel } from '../../models/component.model';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { RecipeModel } from '../../models/recipe.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogService } from '../../services/dialog.service';
import { NotifierService } from '../../services/notifier.service';
import { MatSelect } from '@angular/material/select';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { RecalculateRecipeComponent } from '../recalculate-recipe/recalculate-recipe.component';
import { ComponentItemModel } from 'src/app/models/component.model';
import { FocusTrapManager } from '@angular/cdk/a11y/focus-trap/focus-trap-manager';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
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
export class OrderDetailComponent implements OnInit {
  editable = true;
  order?: OrderModel;
  form!: FormGroup;
  packingForm!: FormGroup;
  recipes: RecipeModel[] = [];
  selectedRecipe: RecipeModel | undefined;
  selectedRecipeDisplay: string = '';
  allOrders: OrderListModel[] = [];
  isNew!: boolean;
  now = new Date();
  packingOrderValue: number[] = [];
  operator: UserModel | null = null;
  orderComponent: ComponentModel[] = [];
  selectedValue: number = 0;
  componentNo: number[] = [];
  allOrderPacking?: OrderModelPacking;
  packingOrderDetail?: OrderPacking;
  recipeChanged = false;
  dosePerOrder?: RecalculateOrder | undefined;
  donePerStation: number[] = [];
  packingWeightForm: number[] = [0];
  packingSelect: selectList[] = [
    { value: 0, viewValue: 'Bag' },
    { value: 1, viewValue: 'Big Bag' },
    { value: 2, viewValue: 'Liquid' },
    { value: 3, viewValue: 'Micro' },
  ];
  slecetIdMixers: selectList[] = [
    { value: 1, viewValue: 'Vertical mixer' },
    { value: 2, viewValue: 'Horizontal mixer' },
    { value: 3, viewValue: 'External mixer' },
  ];

  @ViewChild('recipeSelect')
  recipeSelect!: MatSelect;

  constructor(
    private r: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private recipeService: RecipeService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private auth: AuthService
  ) {
    this.prepareForm();
    this.dateAdapter.setLocale('sk-SK');
    this.auth.user$.subscribe((user) => {
      this.operator = user;
      this.form.patchValue({
        operatorId: user?.id || null,
        operatorName: this.ordersService.showFullUserName(user as UserModel),
      });
    });

    this.form
      .get('packingOrders')
      ?.valueChanges.subscribe((change) => this.checkForm(change));
  }

  ngOnInit(): void {
    this.r.params.subscribe((params) => {
      const no = params['id'];
      if (no === 'new') {
        this.editable = true;
        this.isNew = true;
        return;
      }
      this.ordersService.getOrderByNo(no).subscribe((order) => {
        console.log('order: ', order);
        this.editable = false;
        this.isNew = false;
        this.order = order;
        console.log('this order: ', this.order);
        this.orderComponent = order.recipe.components;

        console.log('this this.orderComponent: ', this.orderComponent);
        this.prepareForm();
        this.form.get('idMixer')?.disable({ onlySelf: true });
        this.recipeService.getRecipes().subscribe((recipes) => {
          console.log('recipes: ', recipes);
          this.recipes = recipes;
          this.selectedRecipe = this.recipes.find(
            (r) => r.no === this.order?.recipe.no
          );
          console.log('selected recipe 1: ', this.selectedRecipe);
          this.addRowFromArray();

          this.changeDetectorRef.detectChanges();
        });
      });
    });
    this.recipeService.getRecipes().subscribe((recipes) => {
      console.log('recipes: ', recipes);
      this.recipes = recipes;
      this.selectedRecipe = this.recipes.find(
        (r) => r.no === this.order?.recipe.no
      );
      this.addRowFromArray();

      console.log('selected recipe 2: ', this.selectedRecipe);
      this.changeDetectorRef.detectChanges();
    });
    this.ordersService
      .getOrdersList()
      .subscribe((orders) => (this.allOrders = orders));
  }

  get id() {
    return this.form.get('id') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }
  get customerName() {
    return this.form.get('customerName') as FormControl;
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

  get volumePerDose() {
    return this.form.get('volumePerDose') as FormControl;
  }

  get packingOrders() {
    return this.form.controls['packingOrders'] as FormArray;
  }

  private prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.order?.id || '', [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(22),
        this.validOrderIdValidator.bind(this),
      ]),
      name: new FormControl(this.order?.name || '', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(40),
        this.validOrderNameValidator.bind(this),
      ]),
      customerName: new FormControl(
        this.order?.customerName || '',
        [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(40),]
      ),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      recipeNo: new FormControl(
        this.order?.recipe.no || '',
        Validators.required
      ),
      quantity: new FormControl(
        this.order?.quantity || null,
        Validators.required
      ),
      idMixer: new FormControl(this.order?.idMixer, [
        Validators.required,
        Validators.min(1),
      ]),
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
      volumePerDose: new FormControl(this.order?.volumePerDose, [
        Validators.required,
        Validators.min(50),
        Validators.max(700),
      ]),
      operatorId: new FormControl(this.order?.operator.id || null),
      operatorName: new FormControl(
        this.ordersService.showFullUserName(
          this.order?.operator as UserModel
        ) || null
      ),
      packingOrders: new FormArray([]),
    });
  }

  onEditClick() {
    this.editable = true;
    this.form.get('idMixer')?.enable();
  }

  offEditClick() {
    this.editable = false;
    this.form.get('idMixer')?.disable();
  }

  onDeleteClick() {
    this.translate.get('dialogService').subscribe((successMessage) => {
      this.dialogService
        .confirmDialog(successMessage.dialogOrderDelete)
        .subscribe((result) => {
          if (result) {
            if (this.isNew) {
              this.router.navigate(['/orders']);
            } else {
              this.ordersService.deleteOrder(this.order!.no).subscribe(() => {
                this.router.navigate(['/orders']);
              });
            }
          }
        });
    });
  }

  saveOrder() {
    this.translate.get('dialogService').subscribe((successMessage) => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.recipeSelect?.ngControl?.control?.markAsTouched();
      this.notifier.showNotification(
        successMessage.notifierErrordescription,
        successMessage.close,
        successMessage.error
      );
      return;
    }
    this.editable = false;
    if (this.form.pristine) {
      return;
    }
    console.log('save me ', this.form.value);

    this.componentNo = [];
    this.selectedRecipe?.components.forEach((component, index) => {
      this.componentNo.push(component.no);
    });
    console.log(this.allOrderPacking);

    this.dialogService
      .confirmDialog(successMessage.dialogOrderCreate)
      .subscribe((result) => {
        if (result) {
          if (this.isNew) {
            this.allOrderPacking = this.form.value;

            this.packingOrderDetail = {
              packingOrder: this.form.value.packingOrders,
              recipeNo: this.form.value.recipeNo,
              orderNo: 0,
              componentNo: this.componentNo,
            };
            if (this.allOrderPacking == null || this.dosePerOrder == null) {
              return;
            }
            this.allOrderPacking.doses = this.dosePerOrder;
            this.allOrderPacking.packing = this.packingOrderDetail;
            this.allOrderPacking.BigBagDone = this.donePerStation[0];
            this.allOrderPacking.LiquidDone = this.donePerStation[1];
            this.allOrderPacking.ADSDone = this.donePerStation[2];
            this.allOrderPacking.MicroDone = this.donePerStation[3];

            this.ordersService
              .addOrder(this.allOrderPacking)
              .subscribe((order) => {
                console.log('new order: ', order);
                this.router.navigate(['/orders', order.no]);
              });
          } else {
            this.allOrderPacking = this.form.value;

            this.packingOrderDetail = {
              packingOrder: this.form.value.packingOrders,
              recipeNo: this.form.value.recipeNo,
              orderNo: this.order!.no,
              componentNo: this.componentNo,
            };
            if (this.allOrderPacking == null || this.dosePerOrder == null) {
              return;
            }
            this.allOrderPacking.doses = this.dosePerOrder;
            this.allOrderPacking.packing = this.packingOrderDetail;
            this.allOrderPacking.BigBagDone = this.donePerStation[0];
            this.allOrderPacking.LiquidDone = this.donePerStation[1];
            this.allOrderPacking.ADSDone = this.donePerStation[2];
            this.allOrderPacking.MicroDone = this.donePerStation[3];
            //orderNo: this.order!.no,
            this.ordersService
              .updateOrder(this.order!.no, this.allOrderPacking)
              .subscribe((order) => {
                console.log('updated order: ', order);
              });
          }
        }
      });
    });
  }

  recipeSelected() {
    console.log('selected recipe: ', this.selectedRecipe);
    console.log('this.order', this.packingOrderValue);
    this.recipeChanged = true;
    this.addRowFromArray();
    this.form.get('recipeNo')!.setValue(this.selectedRecipe?.no);
  }

  addRowFromArray() {
    this.packingOrders.controls = [];

    if (this.selectedRecipe == null) {
      console.log(
        '🚀 ~ file: order-detail.component.ts:360 ~ OrderDetailComponent ~ addRowFromArray ~ this.selectedRecipe',
        this.selectedRecipe
      );

      return;
    }

    console.log(
      '🚀 ~ file: order-detail.component.ts:366 ~ OrderDetailComponent ~ addRowFromArray ~ this.orderComponent',
      this.orderComponent
    );
    for (let index of this.selectedRecipe.components.keys()) {
      if (!this.recipeChanged) {
        this.packingForm = new FormGroup({
          packingType: new FormControl(
            this.orderComponent[index].packingType,
            Validators.required
          ),
          packingWeight: new FormControl(
            this.orderComponent[index].packingWeight,
            Validators.required
          ),
        });
        this.packingOrders.push(this.packingForm);

        //this.packingOrders.controls [index].get('packingType')?.disable({onlySelf: true})
      } else {
        this.packingForm = new FormGroup({
          packingType: new FormControl(null, Validators.required),
          packingWeight: new FormControl(0, Validators.required),
        });
        this.packingOrders.push(this.packingForm);
      }
    }

    console.log('this.formr', this.form);
    this.recipeChanged = false;
  }

  recalculateRecipe() {
    this.translate.get('dialogService').subscribe((successMessage) => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.recipeSelect?.ngControl?.control?.markAsTouched();
      this.notifier.showNotification(
        successMessage.notifierErrordescription,
        successMessage.close,
        successMessage.error
      );
      return;
    }

    console.log('save me ', this.form.value);
    console.log('Recalculate recipe: ', this.selectedRecipe);

    this.dialogService
      .customDialog(
        RecalculateRecipeComponent,
        {
          recipe: null,
          selectedRecipe: this.selectedRecipe,
          selectedorder: this.form.value,
          editMode: this.editable,
        },
        { width: '1455px', height: 'auto' }
      )
      .subscribe((result) => {
        if (!this.editable) {
          this.offEditClick();
        }
        if (result == null) {
          return;
        }

        if (result.edit) {
          this.dosePerOrder = result.data;
          this.donePerStation = result.done;
          console.log('this.dosePerOrder', this.dosePerOrder);
          if (this.form.pristine) {
            return;
          }
          this.saveOrder();
        }
      });
    });
  }

  validOrderNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(
      (o) =>
        o.name !== value || (this.order !== null && o.no === this.order?.no)
    );
    console.log('is valid messsing me? ', isValid);
    return isValid ? null : { invalidOrderName: true };
  }

  validOrderIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(
      (o) => o.id !== value || (this.order !== null && o.no === this.order?.no)
    );
    return isValid ? null : { invalidOrderId: true };
  }

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r });
  }

  checkForm(change: PackingInterface[]) {
    console.log(
      '🚀 ~ file: order-detail.component.ts:459 ~ OrderDetailComponent ~ checkForm ~ change',
      change
    );
    this.packingWeightForm = change.map((x) =>
      x.packingType > 0 ? 0 : x.packingWeight
    );
    console.log(
      '🚀 ~ file: order-detail.component.ts:462 ~ OrderDetailComponent ~ checkForm ~ packingWeightForm',
      this.packingWeightForm
    );
  }
  buttonCheck(): void {
    this.packingOrders.setValue([this.packingWeightForm]);
    console.log(
      '🚀 ~ file: order-detail.component.ts:465 ~ OrderDetailComponent ~ checkForm ~ this.packingOrders',
      this.packingOrders
    );
  }
  
}
