import { signal } from '@angular/core';
import { Loan } from '../../shared/types/loan';

export const isLoading = signal(false);
export const error = signal<string | null>(null);

export const loans = signal<Loan[]>([
  {
    id: 1,
    bookId: 1,
    contactName: 'Sofía Martínez',
    loanDate: '2026-03-15',
    dueDate: '2026-04-15',
    returned: false
  }
]);

export const addLoan = (loan: Loan) => {
  loans.update((current) => [...current, loan]);
};

export const markReturned = (id: number) => {
  loans.update((current) =>
    current.map((loan) => (loan.id === id ? { ...loan, returned: true } : loan))
  );
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