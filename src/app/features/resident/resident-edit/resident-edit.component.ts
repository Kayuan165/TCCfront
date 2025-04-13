import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
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
import { PhoneMaskDirective } from '../../../shared/components/directives/phone-mask.directive';
import { NumbersOnlyDirective } from '../../../shared/components/directives/numbers.directive';

@Component({
  selector: 'app-resident-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PhoneMaskDirective,
    NumbersOnlyDirective,
  ],
  templateUrl: './resident-edit.component.html',
  styleUrl: './resident-edit.component.scss',
  standalone: true,
})
export class ResidentEditComponent {
  @Input() resident!: User;
  @Output() residentUpdated = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(14),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(5)]],
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
