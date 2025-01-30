import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { VisitorCardComponent } from '../../../shared/components/visitor-card/visitor-card.component';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  @Input() visitor!: User;
  selectedFile: File | null = null;

  constructor(private userService: UserService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateVisitor() {
    const formData = new FormData();
    formData.append('name', this.visitor.name);
    formData.append('rg', this.visitor.rg);
    formData.append('email', this.visitor.email);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.userService.update(this.visitor.id, formData).subscribe(() => {
      alert('Usuário atualizado com sucesso!');
    });
  }
}
