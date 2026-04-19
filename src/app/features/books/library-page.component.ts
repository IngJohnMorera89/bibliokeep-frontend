import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookCardComponent } from '../../shared/ui/book-card.component';
import { BookStoreService } from '../../shared/services/book-store.service';
import { CreateBookRequest } from '../../shared/types/book-requests';
import { FileService } from '../../shared/services/File.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'bk-library-page',
  standalone: true,
  imports: [ReactiveFormsModule, BookCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './library-page.component.html',
})
export class LibraryPageComponent implements OnInit {
  public readonly bookStore = inject(BookStoreService);
  private readonly fb = inject(FormBuilder);
  private readonly fileService = inject(FileService);

  // Señales para el estado local
  private readonly selectedFile = signal<File | null>(null);

  readonly books = this.bookStore.books;
  readonly isLoading = this.bookStore.isLoading;
  readonly error = this.bookStore.error;

  readonly searchForm = this.fb.group({
    query: [''],
  });

  readonly bookForm = this.fb.group({
    title: ['', [Validators.required]],
    authors: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^\d{10}(\d{3})?$/)]],
    description: [''],
    status: ['DESEADO', [Validators.required]],
    rating: [1],
  });

  async ngOnInit() {
    try {
      await this.bookStore.fetchAllBooks();
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  onSelectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  async addBook() {
    if (this.bookForm.invalid) return;

    const raw = this.bookForm.value;

    // 1. Preparamos el objeto base
    let request: CreateBookRequest = {
      title: raw.title ?? '',
      authors: (raw.authors ?? '')
        .split(',')
        .map((author) => author.trim())
        .filter(Boolean),
      isbn: raw.isbn ?? '',
      description: raw.description || 'Libro agregado manualmente.',
      status: (raw.status as any) || 'DESEADO',
      rating: Number(raw.rating) || 1,
    };

    try {
      const fileToUpload = this.selectedFile();

      if (fileToUpload) {
        // 2. Optimizamos la imagen
        const blob = await this.fileService.optimizeImage(fileToUpload);

        // 3. Subimos el archivo
        this.fileService.upload(blob).subscribe({
          next: (resp) => {
            /** * CORRECCIÓN CLAVE:
             * Guardamos SOLO la ruta relativa (ej: "/public/imagen.blob").
             * NO concatenamos environment.backendUrl aquí.
             */
            request.thumbnail = resp.url;
            this.executeCreate(request);
          },
          error: (err) => console.error('Error subiendo imagen:', err),
        });
      } else {
        // 4. Si no hay imagen, enviamos el request tal cual
        this.executeCreate(request);
      }
    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
    }
  }

  private async executeCreate(request: CreateBookRequest) {
    try {
      await this.bookStore.createBook(request);
      this.resetForm();
      // Opcional: recargar libros si no se actualiza la señal automáticamente
      // await this.bookStore.fetchAllBooks();
    } catch (error) {
      console.error('Error al crear el libro:', error);
    }
  }

  private resetForm() {
    this.bookForm.reset({
      title: '',
      authors: '',
      isbn: '',
      description: '',
      status: 'DESEADO',
      rating: 1,
    });
    this.selectedFile.set(null);

    // Limpiar el input de tipo file en el HTML si es necesario
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
