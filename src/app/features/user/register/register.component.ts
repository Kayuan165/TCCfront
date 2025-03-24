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
    photo: null,
  };
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: [
        '',
        [Validators.required, Validators.minLength(10), Validators.email],
      ],
      photo: [null, Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.toast.toastService.showError(
          'Por favor, selecione um arquivo de imagem válido!'
        );
        this.selectedFile = null;
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.toast.toastService.showError(
          'O tamanho da imagem não pode exceder 2MB'
        );
        return;
      }

      this.selectedFile = file;
      this.registerForm.patchValue({ photo: file });
    } else {
      this.selectedFile = null;
      this.registerForm.patchValue({ photo: null });
    }
  }
  onSubmit(): void {
    console.log('Formulário:', this.registerForm.value);
    console.log('Valid:', this.registerForm.valid);

    if (this.registerForm.valid && this.selectedFile) {
      const user: User = {
        id: this.registerForm.get('id')?.value,
        name: this.registerForm.get('name')?.value,
        rg: this.registerForm.get('rg')?.value,
        email: this.registerForm.get('email')?.value,
        photo: this.selectedFile,
      };

      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('rg', user.rg);
      formData.append('email', user.email);
      formData.append('photo', user.photo);

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
