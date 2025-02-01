import { Component, OnInit, signal } from '@angular/core';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../edit/edit.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { VisitorCardComponent } from '../../../shared/components/visitor-card/visitor-card.component';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-visitor-list',
  imports: [CommonModule, EditComponent, ModalComponent, VisitorCardComponent],
  templateUrl: './visitor-list.component.html',
  styleUrl: './visitor-list.component.scss',
})
export class VisitorListComponent implements OnInit {
  visitors: User[] = [];
  selectedVisitor: User | null = null;
  selectedVisitorId: number | null = null;
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors() {
    this.userService.getAll().subscribe((data) => {
      this.visitors = data;
    });
  }

  openEditModal(visitor: User) {
    this.selectedVisitor = visitor;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  openDeleteModal(visitorId: number) {
    this.selectedVisitorId = visitorId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    if (this.selectedVisitorId !== null) {
      this.userService.delete(this.selectedVisitorId).subscribe(() => {
        this.loadVisitors();
        this.toastService.showSucess('Visitante excluído com sucesso!');
        this.closeDeleteModal();
      });
    }
  }
}
