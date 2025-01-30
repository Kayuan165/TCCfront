import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/Interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { EditComponent } from "../edit/edit.component";

@Component({
  selector: 'app-visitor-list',
  imports: [CommonModule, EditComponent],
  templateUrl: './visitor-list.component.html',
  styleUrl: './visitor-list.component.scss',
})
export class VisitorListComponent implements OnInit {
  visitors: User[] = [];
  selectedVisitor: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors() {
    this.userService.getAll().subscribe((data) => {
      this.visitors = data;
    });
  }

  editVisitor(visitor: User) {
    this.selectedVisitor = visitor;
  }

  deleteVisitor(id: number) {
    if (confirm('Tem certeza que deseja excluir o visitante?')) {
      this.userService.delete(id).subscribe(() => {
        this.loadVisitors();
      });
    }
  }
}
