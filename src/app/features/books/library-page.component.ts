import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookCardComponent } from '../../shared/ui/book-card.component';
import { BookStoreService } from './book-store.service';

@Component({
  selector: 'bk-library-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './library-page.component.html'
})
export class LibraryPageComponent {
  readonly store = inject(BookStoreService);
  private fb = inject(FormBuilder);

  readonly searchForm = this.fb.group({
    query: ['']
  });

  readonly bookForm = this.fb.group({
    title: ['', [Validators.required]],
    authors: ['', [Validators.required]],
    isbn: ['', [Validators.required]],
    status: ['DESEADO', [Validators.required]]
  });

  addBook() {
    if (this.bookForm.invalid) {
      return;
    }

    const raw = this.bookForm.value;
    this.store.addBook({
      id: Date.now(),
      title: raw.title ?? '',
      authors: (raw.authors ?? '').split(',').map((author) => author.trim()).filter(Boolean),
      isbn: raw.isbn ?? '',
      description: 'Libro agregado manualmente a tu colección.',
      thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=250&q=80',
      status: raw.status as 'DESEADO' | 'COMPRADO' | 'LEYENDO' | 'LEIDO' | 'ABANDONADO',
      rating: 0,
      isLent: false
    });

    this.bookForm.reset({ title: '', authors: '', isbn: '', status: 'DESEADO' });
  }
}
