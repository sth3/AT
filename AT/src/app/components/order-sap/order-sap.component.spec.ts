import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSapComponent } from './order-sap.component';

describe('OrderSapComponent', () => {
  let component: OrderSapComponent;
  let fixture: ComponentFixture<OrderSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
