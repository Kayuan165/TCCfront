import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
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
  selector: 'app-resident-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resident-edit.component.html',
  styleUrl: './resident-edit.component.scss',
  standalone: true,
})
export class ResidentEditComponent {
  @Input() resident!: User;
  @Output() residentUpdated = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);

  fileName = computed(() => {
    const file = this.selectedFile();
    return file ? file.name : 'Nenhum arquivo selecionado';
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{7,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      photo: [null],
    });
  }

  ngOnInit() {
    if (this.resident) {
      this.form.patchValue(this.resident);
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

  updateResidents() {
    if (this.form.invalid) {
      this.toastService.showError('Por favor, corrija os dados do formulário.');
      this.closeModal.emit();
      return;
    }

    const formValues = this.form.value;
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value != null && value !== undefined && key !== 'photo') {
        formData.append(key, String(value));
      }
    });

    if (this.selectedFile() instanceof File) {
      formData.append('photo', this.selectedFile() as File);
    }

    this.isSubmitting.set(true);
    this.userService.update(this.resident.id, formData).subscribe({
      next: (updatedResidents) => {
        this.toastService.showSucess('Morador atualizado com sucesso!');
        this.residentUpdated.emit(updatedResidents);
        setTimeout(() => this.closeModal.emit(), 200);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        this.toastService.showError(
          'Erro ao atualizar o morador, tente novamente.'
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
