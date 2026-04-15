
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookCardComponent } from '../../shared/ui/book-card.component';
import { BookStoreService } from '../../shared/services/book-store.service';
import { CreateBookRequest } from '../../shared/types/book-requests';

@Component({
  selector: 'bk-library-page',
  standalone: true,
  imports: [ReactiveFormsModule, BookCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './library-page.component.html'
})
export class LibraryPageComponent implements OnInit {
  public readonly bookStore = inject(BookStoreService);
  private readonly fb = inject(FormBuilder);

  // Expose store signals to template
  readonly books = this.bookStore.books;
  readonly isLoading = this.bookStore.isLoading;
  readonly error = this.bookStore.error;

  readonly searchForm = this.fb.group({
    query: ['']
  });

  readonly bookForm = this.fb.group({
    title: ['', [Validators.required]],
    authors: ['', [Validators.required]],
    isbn: ['', [Validators.required]],
    description: [''],
    status: ['DESEADO', [Validators.required]],
    rating: [0]
  });
store: any;

  async ngOnInit() {
    try {
      await this.bookStore.fetchAllBooks();
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  async addBook() {
    if (this.bookForm.invalid) {
      return;
    }

    try {
      const raw = this.bookForm.value;
      const request: CreateBookRequest = {
        title: raw.title ?? '',
        authors: (raw.authors ?? '').split(',').map((author) => author.trim()).filter(Boolean),
        isbn: raw.isbn ?? '',
        description: raw.description || 'Libro agregado manualmente a tu colección.',
        thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=250&q=80',
        status: (raw.status as any) || 'DESEADO',
        rating: (raw.rating && raw.rating > 0) ? raw.rating : 1
      };

      await this.bookStore.createBook(request);
      this.bookForm.reset({ title: '', authors: '', isbn: '', description: '', status: 'DESEADO', rating: 0 });
    } catch (error) {
      console.error('Error creating book:', error);
    }
  }
}
