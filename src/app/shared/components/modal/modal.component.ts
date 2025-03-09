import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  private _isOpen = signal(false);

  @Input()
  set isOpen(value: boolean) {
    this._isOpen.set(value);
  }

  get isOpen(): boolean {
    return this._isOpen();
  }

  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  isVisible: Signal<boolean> = computed(() => this._isOpen());

  closeModal() {
    this._isOpen.set(false);
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
