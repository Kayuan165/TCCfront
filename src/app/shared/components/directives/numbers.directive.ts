import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersOnly]',
  standalone: true,
})
export class NumbersOnlyDirective {
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }
}
