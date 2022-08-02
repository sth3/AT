import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {

  form: FormGroup;
  roles = Object.keys(UserRole);
  noMatch: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    allUsers: UserModel[],
    user: UserModel,
    editMode: boolean
  }) {
    this.form = new FormGroup({
      username: new FormControl(data.user ? data.user.username : '',
        [Validators.required, Validators.minLength(5), this.validUserNameValidator.bind(this)]),
      role: new FormControl(data.user ? data.user.role : UserRole.OPERATOR,
        [Validators.required]),
      firstName: new FormControl(data.user ? data.user.firstName : '',
        [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(data.user ? data.user.lastName : '',
        [Validators.required, Validators.minLength(3)]),
      password: new FormControl({ value: '', disabled: this.data.user }, [Validators.required, Validators.minLength(5)]),
      confirmPass: new FormControl({ value: '', disabled: this.data.user }, [Validators.required, Validators.minLength(5)]),
    });
  }

  get username() {
    return this.form.get('username') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get confirmPass() {
    return this.form.get('confirmPass') as FormControl;
  }

  ngOnInit(): void {
  }

  validUserNameValidator(control: FormControl) {
    const value = control.value;
    const allUsers = this.data.allUsers;
    const user = this.data.user;
    const isValid = allUsers.every(u => u.username !== value.toLowerCase()
      || (user !== null && u.id === user.id));
    return isValid ? null : { invalidUserName: true };
  }
}
