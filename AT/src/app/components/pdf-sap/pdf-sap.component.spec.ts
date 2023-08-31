import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfSapComponent } from './pdf-sap.component';

describe('PdfSapComponent', () => {
  let component: PdfSapComponent;
  let fixture: ComponentFixture<PdfSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
