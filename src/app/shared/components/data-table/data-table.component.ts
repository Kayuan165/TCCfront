import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DataTableColumn {
  header: string;
  field: string;
}
@Component({
  selector: 'app-data-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  standalone: true,
})
export class DataTableComponent<T extends { id: number }> implements OnChanges {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: T[] = [];
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<number>();

  searchTerm = '';
  filteredData: T[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filteredData = [...this.data];
    }
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter((item) =>
      this.columns.some((column) => {
        const value = item[column.field as keyof T];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }

  getValue(item: T, field: string): any {
    return (item as any)[field];
  }
}
