import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentModel } from '../../models/component.model';

@Component({
  selector: 'app-edit-component-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.editMode ? 'Edit' : 'Create' }}
      component {{data.editMode ? data.component.id : ''}}</h1>
    <div mat-dialog-content style="height: 250px; width: 100%">
      <form [formGroup]="form">
        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>Component name</mat-label>
          <input matInput placeholder="Name" formControlName="name">
          <mat-error *ngIf="name!.hasError('required')">Component name is required.</mat-error>
          <mat-error *ngIf="name!.hasError('minlength')">Component name must be at least 3 characters long.
          </mat-error>
          <mat-error *ngIf="name!.hasError('invalidComponentName')">This component name is already in use.
          </mat-error>
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>Component ID</mat-label>
          <input matInput placeholder="ID" formControlName="id">
          <mat-error *ngIf="id!.hasError('required')">Component ID is required.</mat-error>
          <mat-error *ngIf="id!.hasError('minlength') || id!.hasError('maxlength')">Component ID must be exactly
            10 characters long.
          </mat-error>
          <mat-error *ngIf="id!.hasError('invalidComponentId')">This ID is already in use.
          </mat-error>
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>Packing</mat-label>
          <input matInput placeholder="Packing" formControlName="packing" type="number" min="0" onfocus="this.select()">
          <mat-error *ngIf="packing!.hasError('required')">Packing is required.</mat-error>
          

          <!-- <mat-error *ngIf="packing!.hasError('minlength') || packing!.hasError('maxlength')">Component ID must be exactly
            10 characters long.
          </mat-error> -->
          <span matSuffix>kg</span>
        </mat-form-field>

    

      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="!form.valid">Save</button>
    </div>
  `,
})
export class EditComponentDialogComponent implements OnInit {

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    allComponents: ComponentModel[],
    component: ComponentModel,
    editMode: boolean
  }) {
    this.form = new FormGroup({
      name: new FormControl(data.component ? data.component.name : '',
        [Validators.required, Validators.minLength(3), this.validComponentNameValidator.bind(this)]),
      id: new FormControl(data.component ? data.component.id : this.getNewId(data.allComponents),
        [Validators.required, Validators.minLength(10), Validators.maxLength(10),
        this.validComponentIdValidator.bind(this)]),
      packing: new FormControl(data.component ? data.component.packing : '',
       [Validators.required, Validators.minLength(1), Validators.maxLength(3),
       this.validComponentPackingValidator.bind(this)])
    });
  }

  get name() {
    return this.form.get('name');
  }

  get id() {
    return this.form.get('id');
  }

  get packing() {
    return this.form.get('packing');
  }

  ngOnInit(): void {
  }

  validComponentNameValidator(control: FormControl) {
    const value = control.value;
    const allComponents = this.data.allComponents;
    const currentComponent = this.data.component;
    const isValid = allComponents.every(component => component.name !== value.toLowerCase()
      || (currentComponent !== null && component.no === currentComponent.no));
    return isValid ? null : { invalidComponentName: true };
  }

  validComponentIdValidator(control: FormControl) {
    const value = control.value;
    const allComponents = this.data.allComponents;
    const currentComponent = this.data.component;
    const isValid = allComponents.every(component => component.id !== value.toLowerCase()
      || (currentComponent !== null && component.no === currentComponent.no));
    return isValid ? null : { invalidComponentId: true };
  }

  validComponentPackingValidator(control: FormControl) {
    const value = control.value;
    const allComponents = this.data.allComponents;
    const currentComponent = this.data.component;
    const isValid = allComponents.every(component => component.packing !== value.toLowerCase()
      || (currentComponent !== null && component.no === currentComponent.no));
    return isValid ? null : { invalidComponentPacking: true };
  }

  getNewId(allComponents: ComponentModel[]): string {
    const maxId = allComponents
      .filter(c => !isNaN(parseInt(c.id)))
      .reduce((max, component) => Math.max(max, parseInt(component.id)), 0);
    return (maxId + 1).toString().padStart(10, '0');
  }

}
