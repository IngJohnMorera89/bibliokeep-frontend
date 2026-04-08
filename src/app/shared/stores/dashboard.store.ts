import { computed } from '@angular/core';
import { books } from './books.store';
import { loans } from './loans.store';

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