import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecalculateRecipeComponent } from './recalculate-recipe.component';

describe('RecalculateRecipeComponent', () => {
  let component: RecalculateRecipeComponent;
  let fixture: ComponentFixture<RecalculateRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecalculateRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalculateRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
