import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailSapComponent } from './order-detail-sap.component';

describe('OrderDetailSapComponent', () => {
  let component: OrderDetailSapComponent;
  let fixture: ComponentFixture<OrderDetailSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
