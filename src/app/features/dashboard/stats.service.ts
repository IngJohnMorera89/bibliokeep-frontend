import { Injectable, computed } from '@angular/core';
import { BookStoreService } from '../books/book-store.service';
import { LoanService } from '../loans/loan.service';

export interface DashboardMetrics {
  booksOwned: number;
  booksRead: number;
  monthlyGoal: number;
  booksLent: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(
    private bookStore: BookStoreService,
    private loanService: LoanService
  ) {}

  readonly metrics = computed<DashboardMetrics>(() => {
    const booksOwned = this.bookStore.books().length;
    const booksRead = this.bookStore.books().filter((book) => book.status === 'LEIDO').length;
    const booksLent = this.loanService.loans().filter((loan) => !loan.returned).length;
    const monthlyGoal = 3;

    return { booksOwned, booksRead, monthlyGoal, booksLent };
  });
}
