import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Loan } from '../types/loan';
import { CreateLoanRequest } from '../types/loan-requests';
import { 
  loans, 
  addLoan, 
  markReturned,
  isLoading as loansLoading,
  error as loansError,
  setLoading,
  setError,
  clearError
} from '../stores/loans.store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.backendUrl}api/loans`;

  // Expose store signals
  readonly loans = loans;
  readonly isLoading = loansLoading;
  readonly error = loansError;

  /**
   * Create a new loan
   */
  async createLoan(request: CreateLoanRequest): Promise<Loan> {
    try {
      setLoading(true);
      clearError();

      const loan = await firstValueFrom(
        this.http.post<Loan>(`${this.apiUrl}`, request)
      );

      addLoan(loan);
      return loan;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear préstamo';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get all loans
   */
  async fetchAllLoans(): Promise<Loan[]> {
    try {
      setLoading(true);
      clearError();

      const loans = await firstValueFrom(
        this.http.get<Loan[]>(`${this.apiUrl}`)
      );

      return loans;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener préstamos';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get a single loan by ID
   */
  async fetchLoanById(id: number): Promise<Loan> {
    try {
      setLoading(true);
      clearError();

      const loan = await firstValueFrom(
        this.http.get<Loan>(`${this.apiUrl}/${id}`)
      );

      return loan;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al obtener préstamo';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Mark a loan as returned
   */
  async returnLoan(id: number): Promise<Loan> {
    try {
      setLoading(true);
      clearError();

      const returnedLoan = await firstValueFrom(
        this.http.patch<Loan>(`${this.apiUrl}/${id}/return`, {})
      );

      markReturned(id);
      return returnedLoan;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al devolver préstamo';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}
