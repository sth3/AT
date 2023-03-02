import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-change-dialog',
  template: `
    <h1 mat-dialog-title>{{'users.changePassword' | translate}}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field style="width: 100%" appearance="outline">
          <input matInput type="password" formControlName="oldPassword" placeholder="{{'users.oldPassword' | translate}}">
        </mat-form-field>
        <mat-form-field style="width: 100%" appearance="outline">
          <input matInput type="password" formControlName="newPassword" placeholder="{{'users.newPassword' | translate}}">
          <mat-error *ngIf="newPassword.hasError('minlength')">{{'users.minLength' | translate}}</mat-error>
        </mat-form-field>
        <mat-form-field style="width: 100%" appearance="outline">
          <input matInput type="password" formControlName="confirmPassword" placeholder="{{'users.confirmPassword' | translate}}">
          <mat-error *ngIf="confirmPassword.hasError('invalidPassword')">{{'users.match' | translate}}</mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">{{'dialogService.cancel' | translate}}</button>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="!form.valid || !form.dirty">{{'dialogService.ok' | translate}}</button>
    </div>
  `
})
export class PasswordChangeDialogComponent implements OnInit {

  form: FormGroup;
  constructor() {
    this.form = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
    this.form.valueChanges.subscribe(() => {
      this.confirmPassword.setErrors(this.newPassword.value !== this.confirmPassword.value ? { invalidPassword: true } : null);
    });
  }

  get newPassword() {
    return this.form.get('newPassword') as FormControl;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }

  ngOnInit(): void {
  }

}
