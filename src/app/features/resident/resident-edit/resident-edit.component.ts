import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
import { lastValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-resident-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PhoneMaskDirective,
    NumbersOnlyDirective,
  ],
  templateUrl: './resident-edit.component.html',
  styleUrls: ['./resident-edit.component.scss'],
})
export class ResidentEditComponent implements OnInit {
  @Input() resident!: User;
  @Output() residentUpdated = new EventEmitter<User>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  isSubmitting = false;
  isTraining = false;
  trainingComplete = false;
  originalRg: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
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
      this.originalRg = this.resident.rg;
    }
  }

  async startFaceTraining(): Promise<void> {
    const currentRg = this.form.get('rg')?.value;

    if (currentRg !== this.originalRg) {
      if (this.form.get('rg')?.invalid) {
        this.toastService.showError('RG inválido para treinamento');
        return;
      }

      this.isTraining = true;
      try {
        await lastValueFrom(this.userService.startFaceTraining(currentRg));
        this.toastService.showSucess('Treinamento facial iniciado');

        await lastValueFrom(
          this.userService.pollTrainingStatus(currentRg).pipe(
            filter((ready) => ready),
            take(1)
          )
        );

        this.trainingComplete = true;
        this.toastService.showSucess('Treinamento facial concluído!');
      } catch (error) {
        this.toastService.showError(
          'Erro no treinamento facial, tente novamente.'
        );
      } finally {
        this.isTraining = false;
      }
    } else {
      this.trainingComplete = true;
    }
  }

  async updateResidents() {
    if (this.form.invalid) {
      this.toastService.showError('Por favor, corrija os dados do formulário.');
      return;
    }

    if (
      this.form.get('rg')?.value !== this.originalRg &&
      !this.trainingComplete
    ) {
      this.toastService.showInfo(
        'É necessário cadastrar o rosto para o novo RG'
      );
      return;
    }

    this.isSubmitting = true;
    const formValues = this.form.value;

    try {
      const updatedResident = await lastValueFrom(
        this.userService.update(this.resident.id, formValues)
      );

      this.toastService.showSucess('Morador atualizado com sucesso!');
      this.residentUpdated.emit(updatedResident);
      setTimeout(() => this.closeModal.emit(), 200);
    } catch (error) {
      this.toastService.showError(
        'Erro ao atualizar o morador, tente novamente.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
