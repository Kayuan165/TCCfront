import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  @Input() visitor!: User;
  @Output() visitorUpdated = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();
  form: FormGroup;
  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: ['', [Validators.required, Validators.pattern(/^d{7,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      photo: [null],
    });
  }

  ngOnInit() {
    if (this.visitor) {
      this.form.patchValue(this.visitor);
    }
  }

  get formControls() {
    return this.form.controls as { [key: string]: any };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.toastService.showError(
          'Por favor, selecione um arquivo de imagem válido!'
        );
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.toastService.showError('O tamanho da imagem não pode exceder 2MB');
        return;
      }

      this.selectedFile.set(file);
      this.form.patchValue({ photo: file });
    }
  }

  updateVisitor() {
    if (this.form.invalid) {
      this.toastService.showError('Por favor, corrija os erros do formulário.');
      return;
    }

    const formData = new FormData();

    if (this.visitor.name) {
      formData.append('name', this.visitor.name);
    }
    if (this.visitor.rg) {
      formData.append('rg', this.visitor.rg);
    }
    if (this.visitor.email) {
      formData.append('email', this.visitor.email);
    }
    const selectedFile = this.selectedFile();
    if (selectedFile) {
      formData.append('photo', selectedFile, selectedFile.name);
    }

    this.isSubmitting.set(true);
    this.userService.update(this.visitor.id, formData).subscribe({
      next: (updateVisitor) => {
        this.toastService.showSucess('Visitante atualizado com sucesso!');
        this.visitorUpdated.emit(updateVisitor);
        this.closeModal.emit();
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Erro ao atualizar visitante', error);
        this.toastService.showError(
          'Erro ao atualizar o visitante, tente novamente.'
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
