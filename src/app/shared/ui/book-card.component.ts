import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../types/book';

@Component({
  selector: 'bk-book-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-card.component.html'
})
export class BookCardComponent {
  // Inputs y Outputs con el nuevo sistema de Signals de Angular
  readonly book = input<Book>();
  readonly selected = output<MouseEvent>();

  /**
   * Maneja errores de carga de imágenes externas (URLs de internet).
   * Si la imagen falla, intenta cargar un placeholder. 
   * Si el placeholder también falla, oculta la imagen para evitar bucles infinitos.
   */
  updateUrlWithPlaceholder(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const fallbackUrl = 'https://picsum.photos/seed/biblio/200/300?grayscale';

    // Si la URL que llega del formulario falla, el navegador entrará aquí
    if (imgElement.src !== fallbackUrl) {
      imgElement.src = fallbackUrl;
    }
  }
}

