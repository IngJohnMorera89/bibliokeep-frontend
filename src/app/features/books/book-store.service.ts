import { Injectable, computed, signal } from '@angular/core';
import { Book } from '../../shared/types/book';

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  readonly books = signal<Book[]>([
    {
      id: 1,
      title: 'Cien años de soledad',
      authors: ['Gabriel García Márquez'],
      isbn: '9780307474728',
      description: 'Un recorrido mágico por la historia de la familia Buendía en Macondo.',
      thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=250&q=80',
      status: 'LEIDO',
      rating: 5,
      isLent: false
    },
    {
      id: 2,
      title: 'El nombre del viento',
      authors: ['Patrick Rothfuss'],
      isbn: '9788466326832',
      description: 'Una historia épica de magia, música y un héroe legendario.',
      thumbnail: 'https://images.unsplash.com/photo-1496104679561-38b0d5d3d1c2?auto=format&fit=crop&w=250&q=80',
      status: 'LEYENDO',
      rating: 4,
      isLent: false
    }
  ]);

  readonly filter = signal('');

  readonly filteredBooks = computed(() => {
    const query = this.filter().trim().toLowerCase();
    if (!query) {
      return this.books();
    }

    return this.books().filter((book) =>
      [book.title, ...book.authors].some((value) => value.toLowerCase().includes(query))
    );
  });

  setFilter(value: string) {
    this.filter.set(value);
  }

  addBook(book: Book) {
    this.books.update((current) => [...current, book]);
  }
}
