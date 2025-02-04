import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  @Input() visitor!: User;
  selectedFile = signal<File | null>(null);

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  updateVisitor() {
    if (!this.visitor) return;

    const formData = new FormData();
    formData.append('name', this.visitor.name);
    formData.append('rg', this.visitor.rg);
    formData.append('email', this.visitor.email);

    if (this.selectedFile()) {
      formData.append('photo', this.selectedFile() as Blob);
    }

    this.userService.update(this.visitor.id, formData).subscribe(() => {
      this.toastService.showSucess('Visitante atualizado com sucesso');
    });
  }
}
