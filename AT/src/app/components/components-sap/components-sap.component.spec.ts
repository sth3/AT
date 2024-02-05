import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsSapComponent } from './components-sap.component';

describe('ComponentsSapComponent', () => {
  let component: ComponentsSapComponent;
  let fixture: ComponentFixture<ComponentsSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsSapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
