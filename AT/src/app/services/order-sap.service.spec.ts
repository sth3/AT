import { TestBed } from '@angular/core/testing';

import { OrderSapService } from './order-sap.service';

describe('OrderSapService', () => {
  let service: OrderSapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderSapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
