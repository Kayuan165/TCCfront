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
  selectedFile: File | null = null;

  user = {
    name: '',
    rg: '',
  };
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: [
        '',
        [Validators.required, Validators.minLength(10), Validators.email],
      ],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.selectedFile) {
      const user: User = {
        id: this.registerForm.get('id')?.value,
        name: this.registerForm.get('name')?.value,
        rg: this.registerForm.get('rg')?.value,
        email: this.registerForm.get('email')?.value,
        type: 'visitor',
      };

      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('rg', user.rg);
      formData.append('email', user.email);
      formData.append('type', user.type);

      this.userService.register(formData).subscribe(
        () => {
          this.toast.toastService.showSucess(
            'Visitante cadastrado com sucesso!'
          );

          this.registerForm.reset();
        },
        (error) => {
          this.toast.toastService.showError(
            'Erro ao cadastrar visitante. Valide as informações'
          );
          console.error(error);
        }
      );
    } else {
      this.toast.toastService.showInfo('Preencha todos os campos corretamente');
    }
  }
}
