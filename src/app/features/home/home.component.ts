import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  menuAberto: string | null = null;
  cardVisivel = signal(false);
  timeoutMenu: any;

  constructor(private router: Router) {
    setTimeout(() => this.cardVisivel.set(true), 300);
  }

  abrirMenu(opcao: string) {
    clearTimeout(this.timeoutMenu);
    this.menuAberto = opcao;
  }

  fecharMenu() {
    this.timeoutMenu = setTimeout(() => {
      this.menuAberto = null;
    }, 300);
  }

  manterMenuAberto() {
    clearTimeout(this.timeoutMenu);
  }

  navegar(rota: string) {
    this.router.navigate([rota]);
  }
}
