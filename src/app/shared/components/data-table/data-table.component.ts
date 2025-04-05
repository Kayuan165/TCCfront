import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TypeTranslatePipe } from '../pipes/translate.pipe';
import { DomSanitizer } from '@angular/platform-browser';

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
  @Input() showActions: Boolean = true;
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<number>();
  @ContentChild('customCell') customCellTemplate?: TemplateRef<any>;

  searchTerm = '';
  filteredData: T[] = [];

  constructor(private sanitizer: DomSanitizer) {}

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

  getFieldValue(item: any, field: string): any {
    const value = field.split('.').reduce((o, k) => o?.[k], item);

    if (field === 'user.type') {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge ${
          value === 'resident' ? 'badge-resident' : 'badge-visitor'
        }">
          ${value === 'resident' ? 'Morador' : 'Visitante'}
        </span>`
      );
    }

    return value;
  }
}
