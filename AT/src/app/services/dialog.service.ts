import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface ICustomDialogOptions extends MatDialogConfig {
  width: string;
  height: string;
}

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

  customDialog(component: any, data: any, options?: ICustomDialogOptions): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      width: options?.width || '400px',
      height: options?.height || '400px',
      data: data,
      disableClose: options?.disableClose || false
    });
    return dialogRef.afterClosed();
  }
}
