import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirmDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '200px',
      data: {
        message: message,
        buttons: ['Cancel', 'Yes']
      }
    });
    return dialogRef.afterClosed();
  }

  customDialog(component: any, data: any): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      height: '250px',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
