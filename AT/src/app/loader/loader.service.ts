import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  };

  constructor() {
  }

  startLoading() {
    if (!this._isLoading.getValue()) {
      this._isLoading.next(true);
    }
  }

  stopLoading() {
    if (this._isLoading.getValue()) {
      this._isLoading.next(false);
    }
  }
}
