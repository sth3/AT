import { TestBed } from '@angular/core/testing';

import { ComponentSapService } from './component-sap.service';

describe('ComponentSapService', () => {
  let service: ComponentSapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentSapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
