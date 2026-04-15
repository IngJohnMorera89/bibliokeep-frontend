
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanService } from '../../shared/services/loan.service';
import { BookStoreService } from '../../shared/services/book-store.service';
import { CreateLoanRequest } from '../../shared/types/loan-requests';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bk-loans-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loans-page.component.html'
})
export class LoansPageComponent implements OnInit {
  private loanService = inject(LoanService);
  private bookStore = inject(BookStoreService);
  private fb = inject(FormBuilder);

  // Expose signals to template
  readonly loans = this.loanService.loans;
  readonly books = this.bookStore.books;
  readonly isLoading = this.loanService.isLoading;
  readonly error = this.loanService.error;

  readonly loanForm = this.fb.group({
    bookId: ['', [Validators.required]],
    contactName: ['', [Validators.required]],
    loanDate: ['', [Validators.required]],
    dueDate: ['', [Validators.required]]
  });

  async ngOnInit() {
    try {
      await this.loanService.fetchAllLoans();
      await this.bookStore.fetchAllBooks();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async addLoan() {
    if (this.loanForm.invalid) {
      return;
    }

    try {
      const form = this.loanForm.value;
      const request: CreateLoanRequest = {
        bookId: Number(form.bookId),
        contactName: form.contactName ?? '',
        loanDate: form.loanDate ?? '',
        dueDate: form.dueDate ?? ''
      };

      await this.loanService.createLoan(request);
      this.loanForm.reset({ bookId: '', contactName: '', loanDate: '', dueDate: '' });
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  }

  async markReturned(id: number) {
    try {
      await this.loanService.returnLoan(id);
    } catch (error) {
      console.error('Error returning loan:', error);
    }
  }
}
