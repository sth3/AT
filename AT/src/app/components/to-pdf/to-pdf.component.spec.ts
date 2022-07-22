import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToPDFComponent } from './to-pdf.component';

describe('ToPDFComponent', () => {
  let component: ToPDFComponent;
  let fixture: ComponentFixture<ToPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToPDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
