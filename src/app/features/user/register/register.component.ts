import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/Interfaces/user.interface';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { filter, lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastComponent,
    BackButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  registerForm: FormGroup;
  isTraining = false;
  isSubmitting = false;
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
    });
  }

  async startTraining(): Promise<void> {
    if (this.registerForm.invalid) {
      if (this.registerForm.get('rg')?.invalid) {
        this.toast.toastService.showInfo('RG inválido ou incompleto!');
        return;
      } else {
        this.toast.toastService.showInfo(
          'Preencha todos os campos corretamente!'
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
      this.toast.toastService.showInfo(
        'Preencha todos os campos corretamente!'
      );
      return;
    }

    if (!this.trainingComplete) {
      this.toast.toastService.showInfo('Treinamento não concluído!');
      return;
    }

    this.isSubmitting = true;

    const user = {
      id: this.registerForm.get('id')?.value,
      name: this.registerForm.get('name')?.value,
      rg: this.registerForm.get('rg')?.value,
      email: this.registerForm.get('email')?.value,
      type: 'visitor',
    };

    try {
      await lastValueFrom(this.userService.completeRegistration(user));
      this.toast.toastService.showSucess('Visitante cadastrado com sucesso!');
      this.registerForm.reset();
      this.trainingComplete = false;
    } catch (error) {
      this.toast.toastService.showError('Erro ao cadastrar visitante ');
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
