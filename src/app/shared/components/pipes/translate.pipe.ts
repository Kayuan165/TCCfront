import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateType', standalone: true })
export class TypeTranslatePipe implements PipeTransform {
  transform(value: string): string {
    const translations: Record<string, string> = {
      resident: 'Morador',
      visitor: 'Visitante',
    };
    return translations[value.toLowerCase()] || value;
  }
}
