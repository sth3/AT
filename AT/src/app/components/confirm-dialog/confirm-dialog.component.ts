import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <div mat-dialog-content>
        {{data.message}}
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">{{data.buttons[0]}}</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>{{data.buttons[1]}}</button>
    </div>
  `,
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    message: string,
    buttons: string[]
  }) { }

  ngOnInit(): void {
  }

}
