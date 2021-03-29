import { Injectable } from '@angular/core';
import {Toast} from '../../interfaces/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(toastData: Toast): void {
    this.toasts.push(toastData);
  }

  remove(toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
