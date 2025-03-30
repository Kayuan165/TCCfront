import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../edit/edit.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-visitor-list',
  imports: [
    CommonModule,
    EditComponent,
    ModalComponent,
    ToastComponent,
    BackButtonComponent,
    FormsModule,
    DataTableComponent,
  ],
  templateUrl: './visitor-list.component.html',
  styleUrl: './visitor-list.component.scss',
})
export class VisitorListComponent {
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  visitors = signal<User[]>([]);
  selectedVisitor = signal<User | null>(null);
  selectedVisitorId = signal<number | null>(null);

  columns = [
    {header: 'Foto', field: 'photo'},
    {header: 'Nome', field: 'name'},
    {header: 'RG', field: 'rg'},
    {header: 'Email', field: 'email'}

  ]

  isEditModalOpen: Signal<boolean> = computed(() => !!this.selectedVisitor());
  isDeleteModalOpen: Signal<boolean> = computed(
    () => !!this.selectedVisitorId()
  );

  constructor() {
    this.loadVisitors();
  }

  private loadVisitors(): void {
    this.userService
      .getAllVisitors()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => this.visitors.set(data),
        error: () =>
          this.toastService.showError('Erro ao carregar visitantes.'),
      });
  }

  openEditModal(visitor: User): void {
    this.selectedVisitor.set(visitor);
  }

  closeEditModal(): void {
    this.selectedVisitor.set(null);
  }

  openDeleteModal(visitorId: number): void {
    this.selectedVisitorId.set(visitorId);
  }

  closeDeleteModal(): void {
    this.selectedVisitorId.set(null);
  }

  confirmDelete(): void {
    const visitorId = this.selectedVisitorId();
    if (!visitorId) return;

    this.userService.delete(visitorId).subscribe({
      next: () => {
        this.visitors.update((currentVisitors) =>
          currentVisitors.filter((v) => v.id !== visitorId)
        );
        this.toastService.showSucess('Visitante excluído com sucesso!');
        this.closeDeleteModal();
      },
      error: () => this.toastService.showError('Erro ao excluir o visitante'),
    });
  }

  onVisitorUpdated(updateVisitor: User): void {
    if (!updateVisitor) return;

    this.visitors.update((currentVisitors) =>
      currentVisitors.map((v) =>
        v.id === updateVisitor.id ? updateVisitor : v
      )
    );

    this.toastService.showSucess('Visitante atualizado com sucesso!');
    this.closeEditModal();
  }
}
