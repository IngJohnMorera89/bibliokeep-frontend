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
  clearError,
  setBooks,
  // Asumo que tienes una función para limpiar o setear libros en tu store.ts
  // Si no la tienes, usaremos addBook en un bucle.
} from '../stores/books.store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.backendUrl}api/books`;

  // Exponemos los Signals del Store para que el componente los use
  readonly books = books;
  readonly isLoading = booksLoading;
  readonly error = booksError;

  /**
   * Obtener todos los libros del backend y sincronizarlos con el Store local
   */
  async fetchAllBooks(): Promise<Book[]> {
    try {
      setLoading(true);
      clearError();

      const fetchedBooks = await firstValueFrom(
        this.http.get<Book[]>(`${this.apiUrl}`)
      );

      // IMPORTANTE: Limpiar el store o actualizarlo. 
      // Si tu store no tiene un setBooks, usamos el addBook que ya tienes:
      setBooks(fetchedBooks);
      
      return fetchedBooks;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener libros';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Crear un nuevo libro
   */
  async createBook(request: CreateBookRequest): Promise<Book> {
    try {
      setLoading(true);
      clearError();

      const book = await firstValueFrom(
        this.http.post<Book>(`${this.apiUrl}`, request)
      );

      // Esto añade el libro al Signal 'books' automáticamente
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
   * Buscar libros (híbrido)
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
   * Actualizar estado del libro
   */
  async updateBookStatus(id: number, status: BookStatus): Promise<Book> {
    try {
      setLoading(true);
      clearError();

      const request: UpdateBookStatusRequest = { status };
      const updatedBook = await firstValueFrom(
        this.http.patch<Book>(`${this.apiUrl}/${id}/status`, request)
      );

      // Aquí podrías disparar una lógica para actualizar el libro en el store local si fuera necesario
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
   * Filtro local (dispara el setFilter de tu books.store.ts)
   */
  setFilter(value: string) {
    setFilter(value);
  }

  /**
   * Getter para que el HTML encuentre 'filteredBooks' si lo llamas así
   */
  get filteredBooks() {
    return this.books; 
  }
}
