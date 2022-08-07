import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedComponentsTableComponent } from './archived-components-table.component';

describe('ArchivedComponentsTableComponent', () => {
  let component: ArchivedComponentsTableComponent;
  let fixture: ComponentFixture<ArchivedComponentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedComponentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedComponentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
