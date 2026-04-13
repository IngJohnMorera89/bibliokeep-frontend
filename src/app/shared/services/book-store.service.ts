import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Book } from '../types/book';
import { CreateBookRequest, UpdateBookStatusRequest, BookStatus } from '../types/book-requests';
import { BookSearchResponse } from '../types/book-search';
import { 
  books, 
  addBook, 
  setFilter, 
  isLoading as booksLoading,
  error as booksError,
  setLoading,
  setError,
  clearError
} from '../stores/books.store';

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  addBook(arg0: { id: number; title: string; authors: string[]; isbn: string; description: string; thumbnail: string; status: string; rating: number; isLent: boolean; }) {
    throw new Error('Method not implemented.');
  }
  filteredBooks() {
    throw new Error('Method not implemented.');
  }
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/books';

  // Expose store signals
  readonly books = books;
  readonly isLoading = booksLoading;
  readonly error = booksError;

  /**
   * Create a new book
   */
  async createBook(request: CreateBookRequest): Promise<Book> {
    try {
      setLoading(true);
      clearError();

      const book = await firstValueFrom(
        this.http.post<Book>(`${this.apiUrl}`, request)
      );

      addBook(book);
      return book;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear libro';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get all books for the current user
   */
  async fetchAllBooks(): Promise<Book[]> {
    try {
      setLoading(true);
      clearError();

      const books = await firstValueFrom(
        this.http.get<Book[]>(`${this.apiUrl}`)
      );

      return books;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener libros';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get a single book by ID
   */
  async fetchBookById(id: number): Promise<Book> {
    try {
      setLoading(true);
      clearError();

      const book = await firstValueFrom(
        this.http.get<Book>(`${this.apiUrl}/${id}`)
      );

      return book;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener libro';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Search books by query (hybrid search: local -> cache -> external)
   */
  async searchBooks(query: string): Promise<BookSearchResponse> {
    try {
      setLoading(true);
      clearError();

      const results = await firstValueFrom(
        this.http.get<BookSearchResponse>(`${this.apiUrl}/search`, {
          params: { q: query }
        })
      );

      return results;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al buscar libros';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Update book status (DESEADO -> COMPRADO -> LEYENDO -> LEIDO)
   */
  async updateBookStatus(id: number, status: BookStatus): Promise<Book> {
    try {
      setLoading(true);
      clearError();

      const request: UpdateBookStatusRequest = { status };
      const updatedBook = await firstValueFrom(
        this.http.patch<Book>(`${this.apiUrl}/${id}/status`, request)
      );

      return updatedBook;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar estado';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Set local filter (client-side only)
   */
  setFilter(value: string) {
    setFilter(value);
  }
}
