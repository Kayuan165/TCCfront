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
    photo: null as File | null,
  };

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rg: ['', [Validators.required, Validators.minLength(9)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('Arquivo selecionado', file.name);
      this.user.photo = file;
    }
  }

  onSubmit() {
    if (this.registerForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('rg', this.registerForm.get('rg')?.value);
      formData.append('photo', this.selectedFile);

      this.userService.register(formData).subscribe(
        (response) => {
          console.log('Usuário cadastrado com sucesso', response);
        },
        (error) => {
          console.error('Erro ao cadastrar usuário', error);
        }
      );
    }
  }
}
