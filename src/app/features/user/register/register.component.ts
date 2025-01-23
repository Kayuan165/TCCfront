import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/Interfaces/user.interface';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
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
      photo: [null, Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.registerForm.patchValue({ photo: this.selectedFile.name });
    }
  }
  onSubmit(): void {
    console.log('Formulário:', this.registerForm.value);
    console.log('Valid:', this.registerForm.valid);
    console.log('Errores:', this.registerForm.errors);

    if (this.registerForm.valid && this.selectedFile) {
      const user: User = {
        name: this.registerForm.get('name')?.value,
        rg: this.registerForm.get('rg')?.value,
        photo: this.selectedFile,
      };

      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('rg', user.rg);
      formData.append('photo', user.photo);

      this.userService.register(formData).subscribe(
        (response) => {
          console.log('Usuário cadastrado com sucesso', response);
        },
        (error) => {
          console.error('Erro ao cadastrar usuário', error);
        }
      );
    } else {
      console.error('Formulário inválido ou arquivo não selecionado');
      console.log(this.registerForm.errors);
    }
  }
}
