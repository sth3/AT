import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NotifierService } from '../../services/notifier.service';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
})
export class UserControlComponent implements OnInit {

  isLoading: boolean = false;
  quickFilter: string = '';
  users: UserModel[] = [];
  dataSource = new MatTableDataSource<UserModel>([]);
  columnsToDisplay = [
    { field: 'id', header: 'ID', width: '5%' },
    { field: 'username', header: 'Username', width: '15%' },
    { field: 'role', header: 'Role' },
    { field: 'firstName', header: 'First name' },
    { field: 'lastName', header: 'Last name' },
    { field: 'registrationDate', header: 'Date of registration' },
    { field: 'lastLoginDate', header: 'Last login' },
  ];
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field), 'actions'];

  constructor(private userService: UserService,
              private dialogService: DialogService,
              private notifier: NotifierService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUsers()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(users => {
        console.log(users);
        this.users = users;
        this.dataSource = new MatTableDataSource<UserModel>(users);
      });
  }

  onEditClick(user: UserModel) {
    this.dialogService.customDialog(EditUserComponent,
      { user, allUsers: this.users, editMode: true },
      { width: '400px', height: '500px' })
      .subscribe(result => {
        if (result) {
          console.log('edit clicked: ', user, result);
          this.userService.updateUser(user.id, result)
            .subscribe(response => {
              console.log('User updated: ', response);
              this.notifier.showDefaultNotification(`User ${user.id} updated`);
              this.users = this.users.map(u => u.id === user.id ? {...u, ...result} : u);
              this.dataSource.data = this.users;
            })
        }
      })
  }

  onDeleteClick(user: UserModel) {
    this.dialogService.confirmDialog(`Are you sure you want to delete user ${user.username}?`)
      .subscribe((result: boolean) => {
        if (result) {
          console.log('delete clicked: ', user);
          this.userService.deleteUser(user.id)
            .subscribe(response => {
              console.log('User deleted: ', response);
              this.notifier.showDefaultNotification(`User ${user.id} deleted`);
              this.users = this.users.filter(u => u.id !== user.id);
              this.dataSource.data = this.users;
            })
        }
      });
  }

  addUser() {
    this.dialogService.customDialog(EditUserComponent,
      { user: null, allUsers: this.users, editMode: false },
      { width: '400px', height: '500px' })
      .subscribe(result => {
        if (result) {
          delete result.confirmPass;
          console.log('create clicked: ', result);
          this.userService.addUser(result)
            .subscribe(response => {
              const user = {...response, ...result };
              console.log('user added: ', user);
              this.notifier.showDefaultNotification('New user added');
              this.users.push(user);
              this.dataSource.data = this.users;
            })
        }
      })
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onChangePassword(user: UserModel) {
    this.dialogService.customDialog(PasswordChangeDialogComponent, {}, { width: '250px', height: '400px' })
      .subscribe(result => {
        if (result) {
          console.log('change password clicked: ', user, result);
          this.userService.changePassword(user.id, result)
            .subscribe(() => {
              console.log('Password changed');
              this.notifier.showDefaultNotification(`Password changed for user ${user.id}`);
            })
        }
      })
  }
}
