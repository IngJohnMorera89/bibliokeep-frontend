import { TestBed } from '@angular/core/testing';
import { BookStoreService } from './book-store.service';

describe('BookStoreService', () => {
  let service: BookStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BookStoreService] });
    service = TestBed.inject(BookStoreService);
  });

  it('should start with a non-empty book collection', () => {
    expect(service.books().length).toBeGreaterThan(0);
  });

  it('should filter books using the query signal', () => {
    service.setFilter('Cien años');
    expect(service.filteredBooks().every((book) => book.title.includes('Cien años') || book.authors.some((author) => author.includes('Cien años')))).toBe(true);
  });

  it('should add a new book to the collection', () => {
    const initialCount = service.books().length;
    service.addBook({
      id: 999,
      title: 'Prueba',
      authors: ['Autor Prueba'],
      isbn: '1234567890',
      description: 'Descripción de prueba',
      thumbnail: '',
      status: 'DESEADO',
      rating: 0,
      isLent: false
    });
    expect(service.books().length).toBe(initialCount + 1);
  });
});
