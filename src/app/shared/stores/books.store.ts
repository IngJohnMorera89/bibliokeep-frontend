import { computed, signal } from '@angular/core';
import { Book } from '../../shared/types/book';

export const isLoading = signal(false);
export const error = signal<string | null>(null);

export const books = signal<Book[]>([
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

export const filter = signal('');

export const filteredBooks = computed(() => {
  const query = filter().trim().toLowerCase();
  if (!query) {
    return books();
  }

  return books().filter((book) =>
    [book.title, ...book.authors].some((value) => value.toLowerCase().includes(query))
  );
});

export const setFilter = (value: string) => {
  filter.set(value);
};

export const addBook = (book: Book) => {
  books.update((current) => [...current, book]);
};

export const setLoading = (loading: boolean) => {
  isLoading.set(loading);
};

export const setError = (err: string | null) => {
  error.set(err);
};

export const clearError = () => {
  error.set(null);
};