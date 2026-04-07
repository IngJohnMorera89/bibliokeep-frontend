import { Injectable, signal } from '@angular/core';
import { Loan } from '../../shared/types/loan';

@Injectable({ providedIn: 'root' })
export class LoanService {
  readonly loans = signal<Loan[]>([
    {
      id: 1,
      bookId: 1,
      contactName: 'Sofía Martínez',
      loanDate: '2026-03-15',
      dueDate: '2026-04-15',
      returned: false
    }
  ]);

  addLoan(loan: Loan) {
    this.loans.update((current) => [...current, loan]);
  }

  markReturned(id: number) {
    this.loans.update((current) =>
      current.map((loan) => (loan.id === id ? { ...loan, returned: true } : loan))
    );
  }
}
