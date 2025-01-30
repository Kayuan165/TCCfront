import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let toastMock: jasmine.SpyObj<ToastComponent>;

  beforeEach(() => {
    // Mock do serviço UserService
    userServiceMock = jasmine.createSpyObj('UserService', ['register']);
    // Mock do ToastComponent
    toastMock = jasmine.createSpyObj('ToastComponent', ['showToast']);

    TestBed.configureTestingModule({
      declarations: [RegisterComponent, ToastComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RegisterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      name: '',
      rg: '',
      email: '',
      photo: null,
    });
  });

  it('should validate the name field as required', () => {
    const nameControl = component.registerForm.get('name');
    expect(nameControl?.valid).toBeFalsy();
    nameControl?.setValue('John');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('should validate the rg field as required and numeric', () => {
    const rgControl = component.registerForm.get('rg');
    expect(rgControl?.valid).toBeFalsy();
    rgControl?.setValue('12345');
    expect(rgControl?.valid).toBeTruthy();
  });

  it('should validate the email field as required and valid email format', () => {
    const emailControl = component.registerForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should handle file selection correctly', () => {
    const inputEvent = { target: { files: [{ name: 'test.jpg' }] } } as any;
    component.onFileSelected(inputEvent);
    expect(component.selectedFile?.name).toBe('test.jpg');
    expect(component.registerForm.get('photo')?.value).toBe('test.jpg');
  });

  it('should call userService.register and show success toast on valid form submission', () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('rg', '123456');
    formData.append('email', 'john@example.com');
    formData.append('photo', 'photo.jpg');

    component.registerForm.setValue({
      name: 'John Doe',
      rg: '123456',
      email: 'john@example.com',
      photo: 'photo.jpg',
    });

    component.selectedFile = new File([], 'photo.jpg');

    userServiceMock.register.and.returnValue(of({}));

    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalledOnceWith(formData);
    expect(toastMock.showToast).toHaveBeenCalledWith(
      'Visitante cadastrado com sucesso!',
      'sucess'
    );
    expect(component.registerForm.value).toEqual({
      name: '',
      rg: '',
      email: '',
      photo: null,
    });
  });

  it('should show error toast when form submission fails', () => {
    const errorResponse = new Error('Cadastro falhou');
    userServiceMock.register.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(toastMock.showToast).toHaveBeenCalledWith(
      'Erro ao cadastrar visitante. Valide as informações',
      'error'
    );
  });

  it('should show info toast if the form is invalid on submit', () => {
    component.registerForm.setValue({
      name: '',
      rg: '',
      email: '',
      photo: null,
    });

    component.onSubmit();

    expect(toastMock.showToast).toHaveBeenCalledWith(
      'Preencha todos os campos corretamente',
      'info'
    );
  });
});
