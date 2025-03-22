import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  @Input() options: { label: string; value: string }[] = [];
  @Output() selectionChange = new EventEmitter<string>();

  onSelect(event: Event) {
    const target = event?.target as HTMLSelectElement;

    if (target) {
      this.selectionChange.emit(target.value);
    }
  }
}
