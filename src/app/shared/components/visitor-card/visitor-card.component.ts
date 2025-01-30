import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-visitor-card',
  imports: [],
  templateUrl: './visitor-card.component.html',
  styleUrl: './visitor-card.component.scss',
})
export class VisitorCardComponent {
  @Input() visitor: any;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  onEdit() {
    this.edit.emit(this.visitor);
  }

  onDelete() {
    this.edit.emit(this.visitor.id);
  }
}
