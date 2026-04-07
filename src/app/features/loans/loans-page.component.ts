import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanService } from './loan.service';
import { BookStoreService } from '../books/book-store.service';

@Component({
  selector: 'bk-loans-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loans-page.component.html'
})
export class LoansPageComponent {
  private loanService = inject(LoanService);
  private bookStore = inject(BookStoreService);
  private fb = inject(FormBuilder);

  readonly loans = computed(() => this.loanService.loans());
  readonly books = computed(() => this.bookStore.books());

  readonly loanForm = this.fb.group({
    bookId: ['', [Validators.required]],
    contactName: ['', [Validators.required]],
    loanDate: ['', [Validators.required]],
    dueDate: ['', [Validators.required]]
  });

  addLoan() {
    if (this.loanForm.invalid) {
      return;
    }

    const form = this.loanForm.value;
    this.loanService.addLoan({
      id: Date.now(),
      bookId: Number(form.bookId),
      contactName: form.contactName ?? '',
      loanDate: form.loanDate ?? '',
      dueDate: form.dueDate ?? '',
      returned: false
    });

    this.loanForm.reset({ bookId: '', contactName: '', loanDate: '', dueDate: '' });
  }

  markReturned(id: number) {
    this.loanService.markReturned(id);
  }
}
