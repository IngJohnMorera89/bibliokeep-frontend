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

  readonly books = this.bookStore.books;
  readonly isLoading = this.bookStore.isLoading;
  readonly error = this.bookStore.error;

  readonly searchForm = this.fb.group({
    query: ['']
  });

  readonly bookForm = this.fb.group({
    title: ['', [Validators.required]],
    authors: ['', [Validators.required]],
    thumbnail: [''], // Este campo ahora coincide con el DTO de Java
    isbn: ['', [Validators.required]],
    description: [''],
    status: ['DESEADO', [Validators.required]],
    rating: [1]
  });

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
      
      // Mapeo dinámico hacia el CreateBookRequest
      const request: CreateBookRequest = {
        title: raw.title ?? '',
        authors: (raw.authors ?? '').split(',').map((author) => author.trim()).filter(Boolean),
        isbn: raw.isbn ?? '',
        description: raw.description || 'Libro agregado manualmente a tu colección.',
        // CLAVE: Tomamos el valor del formulario. Si está vacío, enviamos null o una cadena vacía
        thumbnail: raw.thumbnail || '', 
        status: (raw.status as any) || 'DESEADO',
        rating: Number(raw.rating) || 1
      };

      await this.bookStore.createBook(request);
      
      // Limpiamos el formulario después del éxito
      this.bookForm.reset({ 
        title: '', 
        authors: '', 
        thumbnail: '', // Limpiamos también el campo de la URL
        isbn: '', 
        description: '', 
        status: 'DESEADO', 
        rating: 1 
      });
      
    } catch (error) {
      console.error('Error creating book:', error);
    }
  }
}
