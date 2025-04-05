import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(_: InputEvent) {
    const input = this.el.nativeElement;
    let numbers = input.value.replace(/\D/g, '');

    if (numbers.length > 11) {
      numbers = numbers.substring(0, 11);
    }

    let formatted = '';
    if (numbers.length > 0) {
      formatted = '(' + numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      formatted += ') ' + numbers.substring(2, numbers.length > 10 ? 7 : 6);
    }
    if (numbers.length > 6) {
      formatted += '-' + numbers.substring(numbers.length > 10 ? 7 : 6);
    }

    input.value = formatted;

    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
