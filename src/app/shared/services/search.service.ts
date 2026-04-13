import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Book } from '../types/book';
import { BookSearchResponse } from '../types/book-search';
import { 
  results, 
  isLoading as searchLoading,
  error as searchError,
  setLoading,
  setError,
  clearError
} from '../stores/search.store';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/books/search';

  // Expose store signals
  readonly results = results;
  readonly isLoading = searchLoading;
  readonly error = searchError;

  /**
   * Search books with hybrid search strategy (local -> cache -> external)
   * This calls the backend which handles the search logic
   */
  async search(query: string): Promise<BookSearchResponse | null> {
    try {
      setLoading(true);
      clearError();

      if (!query.trim()) {
        // Clear results if query is empty
        return null;
      }

      const response = await firstValueFrom(
        this.http.get<BookSearchResponse>(`${this.apiUrl}`, {
          params: { q: query }
        })
      );

      // Combine all results into a flat array for the UI
      const allBooks: Book[] = [
        ...response.local,
        ...response.cache,
        ...response.external
      ];

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la búsqueda';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}
