import { Injectable, signal } from '@angular/core';
import { Book } from '../../shared/types/book';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly results = signal<Book[]>([]);

  search(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      this.results.set([]);
      return;
    }

    const sample: Book[] = [
      {
        id: 101,
        title: 'Aprende Angular 21',
        authors: ['Equipo BiblioKeep'],
        isbn: '9781234567890',
        description: 'Guía práctica para construir aplicaciones modernas con Angular.',
        thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=250&q=80',
        status: 'DESEADO',
        rating: 5,
        isLent: false
      }
    ];

    this.results.set(sample.filter((book) => book.title.toLowerCase().includes(normalized) || book.authors.some((author) => author.toLowerCase().includes(normalized))));
  }
}
