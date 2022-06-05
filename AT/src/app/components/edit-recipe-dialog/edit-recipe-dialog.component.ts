import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentModel, RecipeModel } from '../../models/recipe.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'app-edit-recipe-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.editMode ? 'Edit' : 'Create' }}
      recipe {{data.editMode ? data.recipe.id : ''}}</h1>
    <div mat-dialog-content style="height: 150px; width: 100%">
      <form [formGroup]="form">
        <mat-form-field style="width: 100%">
          <input matInput placeholder="Name" formControlName="name" >
          <mat-error *ngIf="name!.hasError('required')">Recipe name is required.</mat-error>
          <mat-error *ngIf="name!.hasError('minlength')">Recipe name must be at least 3 characters long.
          </mat-error>
          <mat-error *ngIf="name!.hasError('invalidRecipeName')">This component name is already in use.
          </mat-error>
        </mat-form-field>
        <mat-form-field style="width: 100%">
          <input matInput placeholder="ID" formControlName="id">
          <mat-error *ngIf="id!.hasError('required')">Recipe ID is required.</mat-error>
          <mat-error *ngIf="id!.hasError('minlength') || id!.hasError('maxlength')">Recipe ID must be exactly 10 characters long.
          </mat-error>
          <mat-error *ngIf="id!.hasError('invalidRecipeId')">This ID is already in use.
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="!form.valid">Save</button>
    </div>
  `
})
export class EditRecipeDialogComponent implements OnInit {

  form: FormGroup;
  allComponents: ComponentModel[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                allRecipes: RecipeModel[],
                recipe: RecipeModel,
                editMode: boolean
              },
              private componentService: ComponentService) {
    this.form = new FormGroup({
      name: new FormControl(data.recipe ? data.recipe.name : '',
        [Validators.required, Validators.minLength(3), this.validRecipeNameValidator.bind(this)]),
      id: new FormControl(data.recipe ? data.recipe.id : this.getNewId(data.allRecipes),
        [Validators.required, Validators.minLength(10), Validators.maxLength(10),
          this.validRecipeIdValidator.bind(this)]),
      // todo implement adding components
      // components: new FormArray(data.recipe ? data.recipe?.components.map(component => {
      //     return new FormGroup({
      //       name: new FormControl(component.componentName),
      //       quantity: new FormControl(component.componentSP)
      //     })
      //   }) : [])
    });
  }

  ngOnInit(): void {
    this.componentService.getComponents()
      .subscribe(response => {
        this.allComponents = response;
      })
  }

  get name() {
    return this.form.get('name');
  }

  get id() {
    return this.form.get('id');
  }

  validRecipeNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.name !== value
      || (this.data.recipe !== null && recipe.id === this.data.recipe.id));
    return isValid ? null : { invalidRecipeName: true };
  }

  validRecipeIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.id !== value
      || (this.data.recipe !== null && recipe.id === this.data.recipe.id));
    return isValid ? null : { invalidRecipeId: true };
  }

  getNewId(allRecipes: RecipeModel[]) {
    const maxId = allRecipes.reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
    return (maxId + 1).toString().padStart(10, '0');
  }
}


