import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from '../components/notifier/notifier.component';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) {
  }

  // showNotification(displayMessage:string, buttonText:string){
  //   this.snackBar.open(displayMessage, buttonText, {
  //     duration:5000,
  //     horizontalPosition:'center',
  //     verticalPosition:'bottom'
  //   });
  // }
  showNotification(displayMessage: string, buttonText: string, messageType: 'error' | 'success') {
    this.snackBar.openFromComponent(NotifierComponent, {
      data: {
        message: displayMessage,
        buttonText: buttonText,
        type: messageType == 'error' || 'Chyba' ? 'error' : 'success'
      },

      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageType == 'error' || 'Chyba' ? 'error' : 'success'
    });
  }

  showDefaultNotification(displayMessage: string) {
    this.snackBar.open(displayMessage, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
