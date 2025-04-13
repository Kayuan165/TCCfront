import { CommonModule } from '@angular/common';
import {
  Component,
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
import { NumbersOnlyDirective } from '../../../shared/components/directives/numbers.directive';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NumbersOnlyDirective,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  @Input() visitor!: User;
  @Output() visitorUpdated = new EventEmitter<User>();
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
