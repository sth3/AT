import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {ComponentModel} from '../../models/component.model'

@Component({
  selector: 'app-edit-component-dialog',
  template: `
      
    <h1 mat-dialog-title>
      {{
        data.editMode
          ? ('dialogComponent.edit' | translate)
          : ('dialogComponent.create' | translate)
      }}
      {{ data.editMode ? data.component.id : '' }}
    </h1>
    <div mat-dialog-content style="height: 400px; width: 100%">
      <form [formGroup]="form">
      
        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>{{ 'componentsTableHead.2.item' | translate }}</mat-label>
          <input matInput placeholder="Name" formControlName="name" />
          <mat-error *ngIf="name!.hasError('required')">
          {{ 'componentsTableHead.2.item' | translate }}{{ 'dialogComponent.requiredName' | translate }}
          </mat-error>
          <mat-error *ngIf="name!.hasError('minlength')">
            {{ 'componentsTableHead.2.item' | translate
            }}{{ 'dialogComponent.minlengthName' | translate }}
          </mat-error>
          <mat-error *ngIf="name!.hasError('maxlength')">
            {{ 'componentsTableHead.2.item' | translate
            }}{{ 'dialogComponent.maxlengthName' | translate }}
          </mat-error>
          <mat-error *ngIf="name!.hasError('invalidComponentName')">
            {{ 'dialogComponent.invalidComponentName' | translate }}
          </mat-error>
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>{{ 'componentsTableHead.1.item' | translate }}</mat-label>
          <input matInput placeholder="ID" formControlName="id" />
          <mat-error *ngIf="id!.hasError('required')">
            {{ 'componentsTableHead.1.item' | translate
            }}{{ 'dialogComponent.requiredName' | translate }}
          </mat-error>
          <mat-error *ngIf="id!.hasError('minlength')">
            {{ 'componentsTableHead.1.item' | translate
            }}{{ 'dialogComponent.minlengthName' | translate }}
          </mat-error>
          <mat-error *ngIf="id!.hasError('maxlength')">
            {{ 'componentsTableHead.1.item' | translate
            }}{{ 'dialogComponent.maxlengthID' | translate }}
          </mat-error>
          <mat-error *ngIf="id!.hasError('invalidComponentId')">
            {{ 'dialogComponent.invalidComponentId' | translate }}
          </mat-error>
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>{{ 'componentsTableHead.3.item' | translate }}</mat-label>
          <input
            matInput
            placeholder="Specific bulk weight"
            formControlName="specificBulkWeight"
            type="number"
            min="0"
            max="5"
          />
          <mat-error *ngIf="specificBulkWeight!.hasError('required')">
            {{ 'dialogComponent.requiredSBW' | translate }}
          </mat-error>
          <span matSuffix>kg/l</span>
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>{{ 'componentsTableHead.4.item' | translate }}</mat-label>
          <input
            matInput
            placeholder="Packing Weight"
            formControlName="packingWeight"
            type="number"
            min="0.1"
            max="1200"
          />
          <mat-error *ngIf="packingWeight!.hasError('required')">
            {{ 'dialogComponent.requiredPacking' | translate }}
          </mat-error>
          <span matSuffix>kg</span>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%; ">
          <mat-label>{{ 'componentsTableHead.5.item' | translate }}</mat-label>
          <mat-select formControlName="packingType"  >
            <mat-option
              *ngFor="let packingOrder of 'selectPacking' | translate"
              [value]="packingOrder.value"
            >
              {{ packingOrder.viewValue }}
            </mat-option>
          </mat-select>
        </mat-form-field>
       
      </form>
    </div>

    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">
        {{ 'dialogService.cancel' | translate }}
      </button>
      <button
        mat-button
        [mat-dialog-close]="form.value"
        [disabled]="!form.valid"
      >
        {{ 'dialogService.save' | translate }}
      </button>
    </div>
  `,
})
export class EditComponentDialogComponent implements OnInit {
  form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      allComponents: ComponentModel[]
      component: ComponentModel
      editMode: number
    },
    private dialogRef: MatDialogRef<EditComponentDialogComponent>
  ) {
    console.log("🚀 ~ file: edit-component-dialog.component.ts:130 ~ EditComponentDialogComponent ~ data:", data.component)
    
    dialogRef.disableClose = true
    this.form = new FormGroup({
      name: new FormControl(data.component ? data.component.name : '', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(40),
        this.validComponentNameValidator.bind(this),
      ]),
      id: new FormControl(
        data.component ? data.component.id : '',//this.getNewId(data.allComponents),
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(22),
          this.validComponentIdValidator.bind(this),
        ]
      ),
      specificBulkWeight: new FormControl(
        data.component ? data.component.specificBulkWeight.toFixed(3) : '',
        [Validators.required]
      ),
      packingWeight: new FormControl(
          data.component  ? (data.component.packingWeight ? data.component.packingWeight.toFixed(3) : '' ): '',
        [Validators.required]
      ),
      packingType: new FormControl(
         data.component ? (data.component.packingType>=0 ? data.component.packingType :'') : '',
        [Validators.required]
      ),
    })
  }

  get name() {
    return this.form.get('name')
  }

  get id() {
    return this.form.get('id')
  }

  get specificBulkWeight() {
    return this.form.get('specificBulkWeight')
  }

  get packingWeight() {
    return this.form.get('packingWeight')
  }

  ngOnInit(): void {
    if(this.data.editMode == 1){
      this.form.get('name')?.enable();
      this.form.get('id')?.enable();
      this.form.get('specificBulkWeight')?.enable();
      this.form.get('packingWeight')?.disable();
      this.form.get('packingType')?.disable();
    }else if (this.data.editMode == 2){
      this.form.get('name')?.disable();
      this.form.get('id')?.disable();
      this.form.get('specificBulkWeight')?.disable();
      this.form.get('packingWeight')?.enable();
      this.form.get('packingType')?.enable();
    }
    
  }

  validComponentNameValidator(control: FormControl) {
    const value = control.value
    const allComponents = this.data.allComponents
    const currentComponent = this.data.component
    const isValid = allComponents.every(
      (component) =>
        component.name !== value.toUpperCase() ||
        (currentComponent !== null && component.no === currentComponent.no)
    )
    return isValid ? null : {invalidComponentName: true}
  }

  validComponentIdValidator(control: FormControl) {
    const value = control.value
    const allComponents = this.data.allComponents
    const currentComponent = this.data.component
    const isValid = allComponents.every(
      (component) =>
        component.id !== value.toLowerCase() ||
        (currentComponent !== null && component.no === currentComponent.no)
    )
    return isValid ? null : {invalidComponentId: true}
  }

  getNewId(allComponents: ComponentModel[]): string {
    const maxId = allComponents
      .filter((c) => !isNaN(parseInt(c.id)))
      .reduce((max, component) => Math.max(max, parseInt(component.id)), 0)
    return (maxId + 1).toString().padStart(6, '0')
  }
  
}
