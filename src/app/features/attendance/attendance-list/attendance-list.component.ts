import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { Attendance } from '../../../shared/Interfaces/attendance.interface';
import { AttendanceService } from '../../../shared/services/attendance.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-attendance-list',
  imports: [
    CommonModule,
    BackButtonComponent,
    DataTableComponent,
    FormsModule,
    ToastComponent,
  ],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
})
export class AttendanceListComponent {
  private attendanceService = inject(AttendanceService);
  private toatstService = inject(ToastService);

  attendances = signal<Attendance[]>([]);

  column = [
    { header: 'Nome', field: 'user.name' },
    { header: 'RG', field: 'user.rg' },
    { header: 'Data de Entrada', field: 'formattedEntryTime' },
    { header: 'Data de Saída', field: 'formattedExitTime' },
    { header: 'Tipo', field: 'user.type' },
  ];

  constructor() {
    this.loadAttendances();
  }

  private loadAttendances(): void {
    this.attendanceService
      .getAllAttendaces()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => this.attendances.set(data),
        error: () =>
          this.toatstService.showError('Erro ao carregar entradas e saídas!'),
      });
  }
}
