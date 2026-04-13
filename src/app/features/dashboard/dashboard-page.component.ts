import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { StatsService } from '../../shared/services/stats.service';
import { BookStoreService } from '../../shared/services/book-store.service';
import { LoanService } from '../../shared/services/loan.service';
import { StatsWidgetComponent } from '../../shared/ui/stats-widget.component';

@Component({
  selector: 'bk-dashboard-page',
  standalone: true,
  imports: [CommonModule, StatsWidgetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  private statsService = inject(StatsService);
  private bookStore = inject(BookStoreService);
  private loanService = inject(LoanService);

  // Expose stats signals to template
  readonly metrics = this.statsService.metrics;
  readonly isLoading = this.bookStore.isLoading;
  readonly error = this.bookStore.error;

  async ngOnInit() {
    try {
      await this.bookStore.fetchAllBooks();
      await this.loanService.fetchAllLoans();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }
}
