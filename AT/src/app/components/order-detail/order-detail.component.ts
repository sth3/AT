import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { OrderModel } from '../../models/order.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  editable = true;
  order?: OrderModel;
  form!: FormGroup;
  constructor(private r: ActivatedRoute,
              private router: Router,
              private ordersService: OrdersService) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.r.params.subscribe(params => {
      const no = params['id'];
      if (no === 'new') {
        this.editable = true;
        return;
      }
      this.ordersService.getOrderByNo(no)
        .subscribe(order => {
          console.log('this order: ', order);
          this.editable = false;
          this.order = order;
          this.prepareForm();
        })
    })
  }

  get id() {
    return this.form.get('id') as FormControl;
  }

  private prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.order?.id || '', Validators.required),
      name: new FormControl(this.order?.name || '', Validators.required),
      customerName: new FormControl(this.order?.customerName || '', Validators.required),
      dueDate: new FormControl(this.order?.dueDate, Validators.required),
      recipeNo: new FormControl(this.order?.recipe.no || '', Validators.required),
      quantity: new FormControl(this.order?.quantity || 0, Validators.required),
      idMixer: new FormControl(this.order?.idMixer, Validators.required),
      mixingTime: new FormControl(this.order?.mixingTime || 0, Validators.required),
      idPackingMachine: new FormControl(this.order?.idPackingMachine, Validators.required),
      createdAt: new FormControl(this.order?.createdAt),
      lastUpdate: new FormControl(this.order?.lastUpdate),
      completedAt: new FormControl(this.order?.completedAt),
      operatorId: new FormControl(this.order?.operatorId || '001'),
      // todo get real used id/name here
      operatorName: new FormControl(this.order?.operatorName || 'admin')
    })
  }

  onEditClick() {
    this.editable = true;
  }

  onDeleteClick() {
    // todo
  }
}
