import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  public message: string = '';
  public show: boolean = false;
  public type: 'sucess' | 'error' | 'info' = 'info';

  ngOnInit(): void {}

  showToast(
    message: string,
    type: 'sucess' | 'error' | 'info',
    duration: number = 3000
  ): void {
    (this.message = message),
      (this.type = type),
      (this.show = true),
      setTimeout(() => {
        this.show = false;
      }, duration);
  }
}
