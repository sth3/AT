import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentModel } from '../../models/recipe.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-component-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.editMode ? 'Edit' : 'Create' }} component {{data.editMode ? data.component.id : ''}}</h1>
    <div mat-dialog-content style="height: 70px">
      <mat-form-field>
        <input matInput placeholder="Name" [formControl]="formControl">
        <mat-error *ngIf="formControl.hasError('required')">Component name is required.</mat-error>
        <mat-error *ngIf="formControl.hasError('minlength')">Component name must be at least 3 characters long.</mat-error>
        <mat-error *ngIf="formControl.hasError('invalidComponentName')">This component name is already in use.</mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="{ name: formControl.value }" [disabled]="!formControl.valid">Save</button>
    </div>
  `,
})
export class EditComponentDialogComponent implements OnInit {

  formControl: FormControl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    allComponents: ComponentModel[],
    component: ComponentModel,
    editMode: boolean
   }) {
    this.formControl = new FormControl(data.component?.name,
      [Validators.required,
        Validators.minLength(3),
        this.validComponentNameValidator.bind(this)]);
  }

  ngOnInit(): void {
  }

  validComponentNameValidator(control: FormControl) {
    const value = control.value;
    const allComponents = this.data.allComponents;
    const currentComponent = this.data.component;
    const isValid = allComponents.every(component => component.name !== value
      || (currentComponent !== null && component.id === currentComponent.id ));
    return isValid ? null : { invalidComponentName: true };
  }

}
