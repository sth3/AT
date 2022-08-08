import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedRecipesTableComponent } from './archived-recipes-table.component';

describe('ArchivedRecipesTableComponent', () => {
  let component: ArchivedRecipesTableComponent;
  let fixture: ComponentFixture<ArchivedRecipesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedRecipesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedRecipesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
