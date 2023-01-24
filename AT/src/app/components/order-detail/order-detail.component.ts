import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { OrderListModel, OrderModel } from '../../models/order.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { RecipeModel } from '../../models/recipe.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogService } from '../../services/dialog.service';
import { NotifierService } from '../../services/notifier.service';
import { MatSelect } from '@angular/material/select';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';





@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  animations: [
    trigger('grow', [
      transition(':enter', [
        style({ height: '0', overflow: 'hidden' }),
        animate(500, style({ height: '*' }))
      ]),
      transition(':leave', [
        animate(500, style({ height: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})


export class OrderDetailComponent implements OnInit {

  editable = true;
  order?: OrderModel;
  form!: FormGroup;
  recipes: RecipeModel[] = [];
  selectedRecipe: RecipeModel | undefined;
  selectedRecipeDisplay: string = '';
  allOrders: OrderListModel[] = [];
  isNew!: boolean;
  now = new Date();
  operator: UserModel | null = null;

  @ViewChild('recipeSelect')
  recipeSelect!: MatSelect;

  constructor(private r: ActivatedRoute,
              private router: Router,
              private ordersService: OrdersService,
              private recipeService: RecipeService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialogService: DialogService,
              private notifier: NotifierService,
              private dateAdapter: DateAdapter<Date>,
              private auth: AuthService
              ) {
    this.prepareForm();
    this.dateAdapter.setLocale('sk-SK');
    this.auth.user$.subscribe(user => {
      this.operator = user;
      this.form.patchValue({
        operatorId: user?.id || null,
        operatorName: this.ordersService.showFullUserName(user as UserModel)
      })
    });   
  }

  ngOnInit(): void {
    this.r.params.subscribe(params => {
      const no = params['id'];
      if (no === 'new') {
        this.editable = true;
        this.isNew = true;
        return;
      }
      this.ordersService.getOrderByNo(no)
        .subscribe(order => {
          console.log('this order: ', order);
          this.editable = false;
          this.isNew = false;
          this.order = order;
          this.prepareForm();

          this.recipeService.getRecipes()
            .subscribe(recipes => {
              console.log('recipes: ', recipes);
              this.recipes = recipes;
              this.selectedRecipe = this.recipes.find(r => r.no === this.order?.recipe.no);
              console.log('selected recipe: ', this.selectedRecipe);
              this.changeDetectorRef.detectChanges();
            })
        })
    })
    this.recipeService.getRecipes()
      .subscribe(recipes => {
        console.log('recipes: ', recipes);
        this.recipes = recipes;
        this.selectedRecipe = this.recipes.find(r => r.no === this.order?.recipe.no);
        console.log('selected recipe: ', this.selectedRecipe);
        this.changeDetectorRef.detectChanges();
      })
    this.ordersService.getOrdersList()
      .subscribe(orders => this.allOrders = orders)
  }

  get id() {
    return this.form.get('id') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
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
  
  private prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.order?.id || '', [Validators.required,
        Validators.minLength(10), Validators.maxLength(10), this.validOrderIdValidator.bind(this)]),
      name: new FormControl(this.order?.name || '', [Validators.required,
        Validators.minLength(3), this.validOrderNameValidator.bind(this)]),
      customerName: new FormControl(this.order?.customerName || '', Validators.required),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      recipeNo: new FormControl(this.order?.recipe.no || '', Validators.required),
      quantity: new FormControl(this.order?.quantity || null, Validators.required),
      idMixer: new FormControl(this.order?.idMixer, Validators.required),
      mixingTime: new FormControl(this.order?.mixingTime || null, Validators.required),
      idPackingMachine: new FormControl(this.order?.idPackingMachine, Validators.required),
      idEmptyingStationBag: new FormControl(this.order?.idEmptyingStationBag, Validators.required),
      volumePerDose: new FormControl(this.order?.volumePerDose, Validators.required),
      operatorId: new FormControl(this.order?.operator.id || null),
      operatorName: new FormControl(this.ordersService.showFullUserName(this.order?.operator as UserModel) || null)
    })
  }

  onEditClick() {
    this.editable = true;
  }

  onDeleteClick() {
    this.dialogService.confirmDialog('Are you sure you want to delete this order?')
      .subscribe(result => {
        if (result) {
          if (this.isNew) {
            this.router.navigate(['/orders']);
          } else {
            this.ordersService.deleteOrder(this.order!.no).subscribe(() => {
              this.router.navigate(['/orders']);
            })
          }
        }
      })
  }

  saveOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.recipeSelect?.ngControl?.control?.markAsTouched();
      this.notifier.showNotification('Please fill out all fields correctly.', 'Close', 'error');
      return;
    }
    this.editable = false;
    if (this.form.pristine) {
      return;
    }
    console.log('save me ', this.form.value);
    this.dialogService.confirmDialog('Are you sure you want to save this order?').subscribe(
      (result) => {
        if (result) {
          if (this.isNew) {
            this.ordersService.addOrder(this.form.value).subscribe(order => {
              console.log('new order: ', order);
              this.router.navigate(['/orders', order.no]);
            })
          } else {
            this.ordersService.updateOrder(this.order!.no, this.form.value).subscribe(order => {
              console.log('updated order: ', order);
            })
          }
        }
      }
    )
  }

  recipeSelected() {
    console.log('selected recipe: ', this.selectedRecipe);
    this.form.get('recipeNo')!.setValue(this.selectedRecipe?.no);
  }

  validOrderNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(o => o.name !== value
      || (this.order !== null && o.no === this.order?.no));
    console.log('is valid messsing me? ', isValid);
    return isValid ? null : { invalidOrderName: true };
  }

  validOrderIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.allOrders.every(o => o.id !== value
      || (this.order !== null && o.no === this.order?.no));
    return isValid ? null : { invalidOrderId: true };
  }

  backToOrder() {
    this.router.navigate(['../../orders'], { relativeTo: this.r })
  }


  
}