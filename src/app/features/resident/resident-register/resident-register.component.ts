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
import { filter, lastValueFrom, take } from 'rxjs';

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
  isSubmitting = false;
  isTraining = false;
  trainingComplete = false;

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
    });
  }

  async startTraining(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      if (this.registerForm.get('rg')?.invalid) {
        this.toast.toastService.showInfo('Preencha o campo RG corretamente');
        return;
      } else {
        this.toast.toastService.showInfo(
          'Preencha todos os campos corretamente'
        );
        return;
      }
    }

    this.isTraining = true;
    const rg = this.registerForm.get('rg')?.value;

    try {
      await lastValueFrom(this.userService.startFaceTraining(rg));
      this.toast.toastService.showSucess('Treinamento iniciado com sucesso!');

      await lastValueFrom(
        this.userService.pollTrainingStatus(rg).pipe(
          filter((ready) => ready),
          take(1)
        )
      );

      this.trainingComplete = true;
      this.toast.toastService.showSucess('Treinamento concluído com sucesso!');
    } catch (error) {
      this.toast.toastService.showError(
        'Erro ao iniciar o treinamento facial!'
      );
    } finally {
      this.isTraining = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      this.toast.toastService.showInfo('Preencha todos os campos corretamente');
      return;
    }

    if (!this.trainingComplete) {
      this.toast.toastService.showInfo('Treinamento não concluído!');
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

    try {
      await lastValueFrom(this.userService.completeRegistration(user));
      this.toast.toastService.showSucess('Morador cadastrado com sucesso!');
      this.registerForm.reset();
      this.trainingComplete = false;
    } catch (error) {
      this.toast.toastService.showError('Erro ao cadastrar morador!');
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
