import { computed, signal } from '@angular/core';
import { books } from './books.store';
import { loans } from './loans.store';

export const isLoading = signal(false);
export const error = signal<string | null>(null);

export interface DashboardMetrics {
  booksOwned: number;
  booksRead: number;
  monthlyGoal: number;
  booksLent: number;
}

export const metrics = computed<DashboardMetrics>(() => {
  const booksOwned = books().length;
  const booksRead = books().filter((book) => book.status === 'LEIDO').length;
  const booksLent = loans().filter((loan) => !loan.returned).length;
  const monthlyGoal = 3;

  return { booksOwned, booksRead, monthlyGoal, booksLent };
});

export const setLoading = (loading: boolean) => {
  isLoading.set(loading);
};

export const setError = (err: string | null) => {
  error.set(err);
};

export const clearError = () => {
  error.set(null);
};