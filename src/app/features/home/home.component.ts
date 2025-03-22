import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownComponent } from "../../shared/dropdown/dropdown.component";

@Component({
  selector: 'app-home',
  imports: [DropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  options = [
    { label: 'Visitante', value: 'visitor' },
    { label: 'Morador', value: 'resident' },
  ];

  constructor(private router: Router) {}

  onSelectedChange(selectedValue: string) {
    if (selectedValue) {
      this.router.navigate([`/${selectedValue}`]);
    }
  }
}
