import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message = signal<string | null>(null);
  type = signal<'sucess' | 'error' | 'info'>('info');

  showSucess(msg: string) {
    this.showToast(msg, 'sucess');
  }

  showError(msg: string) {
    this.showToast(msg, 'error');
  }

  showInfo(msg: string) {
    this.showToast(msg, 'info');
  }

  private showToast(msg: string, type: 'sucess' | 'error' | 'info') {
    this.message.set(msg);
    this.type.set(type);
    setTimeout(() => this.message.set(null), 3000);
  }
}
