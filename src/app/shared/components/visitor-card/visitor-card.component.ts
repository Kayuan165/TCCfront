import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../Interfaces/user.interface';

@Component({
  selector: 'app-visitor-card',
  imports: [],
  templateUrl: './visitor-card.component.html',
  styleUrl: './visitor-card.component.scss',
})
export class VisitorCardComponent {
  @Input() visitor!: User;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.visitor);
  }

  onDelete() {
    this.delete.emit(this.visitor.id);
  }
}
