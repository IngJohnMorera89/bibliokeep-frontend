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
  readonly searchService = inject(SearchService);
  private fb = inject(FormBuilder);

  readonly searchForm = this.fb.group({
    query: ['']
  });
}
