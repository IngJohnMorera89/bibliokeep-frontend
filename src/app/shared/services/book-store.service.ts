import { Injectable } from '@angular/core';
import { Book } from '../../shared/types/book';
import { addBook, books, filteredBooks, setFilter } from '../../shared/stores/books.store';

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  readonly books = books;
  readonly filteredBooks = filteredBooks;

  setFilter(value: string) {
    setFilter(value);
  }

  addBook(book: Book) {
    addBook(book);
  }
}
