import { Injectable } from '@angular/core';
import { Loan } from '../../shared/types/loan';
import { addLoan, loans, markReturned } from '../../shared/stores/loans.store';

@Injectable({ providedIn: 'root' })
export class LoanService {
  readonly loans = loans;

  addLoan(loan: Loan) {
    addLoan(loan);
  }

  markReturned(id: number) {
    markReturned(id);
  }
}
