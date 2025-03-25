import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const initialValue = this.el.nativeElement.value;
    let numbers = initialValue.replace(/\D/g, '');

    if (numbers.length > 11) {
      numbers = numbers.substring(0, 11);
    }

    let formatted = '';
    if (numbers.length > 0) {
      formatted = '(' + numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      formatted += ') ' + numbers.substring(2, 7);
    }
    if (numbers.length > 7) {
      formatted += '-' + numbers.substring(7, 11);
    }

    this.el.nativeElement.value = formatted;

    // Trigger ngModel update
    const events = new Event('input', { bubbles: true });
    this.el.nativeElement.dispatchEvent(event);
  }
}
