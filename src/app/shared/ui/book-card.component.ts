import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../shared/types/book'; // Asegúrate de que la ruta sea correcta
import { environment } from '../../../environments/environment';

@Component({
  selector: 'bk-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
})
export class BookCardComponent {
  // Recibe el libro como una Signal de entrada
  readonly book = input<Book>();
  readonly selected = output<MouseEvent>();

  /**
   * Esta es la lógica de la imagen que preguntabas.
   * Resuelve el error de la doble barra (//) y el 403 Forbidden.
   */
  readonly imageUrl = computed(() => {
    const bookData = this.book();

    // CAMBIO AQUÍ: Usamos .thumbnail que es lo que viene del JSON según tu captura
    const path = bookData?.thumbnail;

    if (!bookData || !path) {
      return 'https://picsum.photos/seed/biblio/200/300?grayscale';
    }

    const base = environment.backendUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${cleanPath}`;
  });
  // Maneja el error si la imagen no carga
  updateUrlWithPlaceholder(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const placeholder = 'https://picsum.photos/seed/biblio/200/300?grayscale';

    // Evitamos que si el placeholder también falla, se cree un bucle infinito
    if (imgElement.src !== placeholder) {
      imgElement.src = placeholder;
    }
  }
}
