import { signal } from '@angular/core';
import { Loan } from '../../shared/types/loan';

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