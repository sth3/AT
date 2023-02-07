import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersArchiveComponent } from './orders-archive.component';

describe('OrdersArchiveComponent', () => {
  let component: OrdersArchiveComponent;
  let fixture: ComponentFixture<OrdersArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
