import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Resident } from '../../../shared/Interfaces/resident.interface';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { PhoneMaskDirective } from '../../../shared/components/directives/phone-mask.directive';

@Component({
  selector: 'app-resident-register',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent,
    BackButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    PhoneMaskDirective,
  ],
  templateUrl: './resident-register.component.html',
  styleUrls: ['./resident-register.component.scss'],
})
export class ResidentRegisterComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  registerForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      rg: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(8),
          Validators.maxLength(12),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(15),
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      photo: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.selectedFile || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      this.toast.toastService.showInfo('Preencha todos os campos corretamente');
      return;
    }

    this.isSubmitting = true;

    const user: Resident = {
      id: this.registerForm.get('id')?.value,
      name: this.registerForm.get('name')?.value.trim(),
      rg: this.registerForm.get('rg')?.value,
      phone: this.registerForm.get('phone')?.value,
      address: this.registerForm.get('address')?.value.trim(),
      email: this.registerForm.get('email')?.value.trim(),
      type: 'resident',
    };

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('rg', user.rg);
    formData.append('phone', user.phone);
    formData.append('address', user.address);
    formData.append('email', user.email);
    formData.append('type', user.type);

    this.userService.register(formData).subscribe({
      next: () => {
        this.toast.toastService.showSucess('Morador cadastrado com sucesso!');
        this.registerForm.reset();
        this.selectedFile = null;
        this.isSubmitting = false;
      },
      error: (error) => {
        this.toast.toastService.showError(
          'Erro ao cadastrar morador. Valide as informações'
        );
        console.error(error);
        this.isSubmitting = false;
      },
    });
  }
}
