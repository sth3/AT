import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent implements OnInit {

  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnInit(): void {
  }
}
