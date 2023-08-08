import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecalculateSapComponent } from './recalculate-sap.component';

describe('RecalculateSapComponent', () => {
  let component: RecalculateSapComponent;
  let fixture: ComponentFixture<RecalculateSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecalculateSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalculateSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
