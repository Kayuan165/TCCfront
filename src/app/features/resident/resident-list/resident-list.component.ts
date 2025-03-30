import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { ResidentEditComponent } from '../resident-edit/resident-edit.component';
import { UserService } from '../../../shared/services/user.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { User } from '../../../shared/Interfaces/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-resident-list',
  imports: [
    CommonModule,
    ResidentEditComponent,
    BackButtonComponent,
    ModalComponent,
    ToastComponent,
    DataTableComponent,
    FormsModule,
  ],
  templateUrl: './resident-list.component.html',
  styleUrl: './resident-list.component.scss',
})
export class ResidentListComponent {
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  residents = signal<User[]>([]);
  selectedResidents = signal<User | null>(null);
  selectedResidentsId = signal<number | null>(null);

  columns = [
    { header: 'Foto', field: 'photo' },
    { header: 'Nome', field: 'name' },
    { header: 'RG', field: 'rg' },
    { header: 'Email', field: 'email' },
    { header: 'Telefone', field: 'phone' },
    { header: 'Endereço', field: 'address' },
  ];

  isEditModalOpen: Signal<boolean> = computed(() => !!this.selectedResidents());
  isDeleteModalOpen: Signal<boolean> = computed(
    () => !!this.selectedResidentsId()
  );

  constructor() {
    this.loadResidents();
  }

  private loadResidents(): void {
    this.userService
      .getAllResident()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => this.residents.set(data),
        error: () => this.toastService.showError('Erro ao carregar Moradores'),
      });
  }

  openEditModal(resident: User): void {
    this.selectedResidents.set(resident);
  }
  closeEditModal(): void {
    this.selectedResidents.set(null);
  }

  openDeleteModal(residentId: number): void {
    this.selectedResidentsId.set(residentId);
  }

  closeDeleteModal(): void {
    this.selectedResidentsId.set(null);
  }

  confirmDelete(): void {
    const residentId = this.selectedResidentsId();
    if (!residentId) return;

    this.userService.delete(residentId).subscribe({
      next: () => {
        this.residents.update((currentResidents) =>
          currentResidents.filter((v) => v.id !== residentId)
        );

        this.toastService.showSucess('Morador excluído com sucesso!');
        this.closeDeleteModal();
      },
      error: () => this.toastService.showError('Erro ao excluir vistante!'),
    });
  }

  onResidentUpdated(updateResident: User): void {
    if (!updateResident) return;

    this.residents.update((currentResidents) =>
      currentResidents.map((v) =>
        v.id === updateResident.id ? updateResident : v
      )
    );

    this.toastService.showSucess('Morador atualizado com sucesso!');
    this.closeEditModal();
  }
}
