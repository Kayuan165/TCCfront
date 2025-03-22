import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
  standalone: true,
})
export class BackButtonComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
