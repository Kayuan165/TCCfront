import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
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

  fileName = computed(() => {
    const file = this.selectedFile()
    return file ? file.name : 'Nenhum arquivo selecionado'
  })

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{7,14}$/)]],
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
      this.form.patchValue({ photo: file.name });
      this.form.markAsDirty();
    }
  }

  updateVisitor() {
    if (this.form.invalid) {
      this.toastService.showError('Por favor, corrija os erros do formulário.');
      this.closeModal.emit();
      return;
    }

    const formValues = this.form.value;
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'photo') {
        formData.append(key, String(value));
      }
    });

    if (this.selectedFile instanceof File) {
      formData.append('photo', this.selectedFile);
    }

    this.isSubmitting.set(true);
    this.userService.update(this.visitor.id, formValues).subscribe({
      next: (updateVisitor) => {
        this.toastService.showSucess('Visitante atualizado com sucesso!');
        this.visitorUpdated.emit(updateVisitor);
        setTimeout(() => this.closeModal.emit(), 200);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        this.toastService.showError(
          'Erro ao atualizar o visitante, tente novamente.'
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
