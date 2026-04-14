import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookCardComponent } from '../../shared/ui/book-card.component';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'bk-book-search-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-search-page.component.html'
})
export class BookSearchPageComponent {
  public readonly searchService = inject(SearchService);
  private readonly fb = inject(FormBuilder);

  // Expose search service signals to template
  readonly results = this.searchService.results;
  readonly isLoading = this.searchService.isLoading;
  readonly error = this.searchService.error;

  readonly searchForm = this.fb.group({
    query: ['']
  });

  async onSearch() {
    const query = this.searchForm.get('query')?.value;
    if (!query || !query.trim()) {
      return;
    }

    try {
      await this.searchService.search(query);
    } catch (error) {
      console.error('Search error:', error);
    }
  }
}
