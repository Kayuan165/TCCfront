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

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild('toast') toast!: ToastComponent;
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
    if (input?.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.registerForm.patchValue({ photo: this.selectedFile.name });
    } else {
      this.selectedFile = null;
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
          this.toast.showToast('Visitante cadastrado com sucesso!', 'sucess');

          this.registerForm.reset();
        },
        (error) => {
          this.toast.showToast(
            'Erro ao cadastrar visitante. Valide as informações',
            'error'
          );
          console.error(error);
        }
      );
    } else {
      this.toast.showToast('Preencha todos os campos corretamente', 'info');
    }
  }
}
