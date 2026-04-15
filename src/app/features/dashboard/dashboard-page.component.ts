import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStoreService } from '../../shared/services/book-store.service';

@Component({
  selector: 'bk-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  public readonly bookStore = inject(BookStoreService);

  // Estadísticas basadas en los libros cargados en el store local
  totalBooks = computed(() => this.bookStore.books().length);
  
  readBooks = computed(() => 
    this.bookStore.books().filter(b => b.status === 'LEIDO').length
  );
  
  readingBooks = computed(() => 
    this.bookStore.books().filter(b => b.status === 'LEYENDO').length
  );
  
  wishlistBooks = computed(() => 
    this.bookStore.books().filter(b => b.status === 'DESEADO').length
  );

  // Lógica para el gráfico (por ahora representativa)
  hasData = computed(() => this.bookStore.books().length > 0);
}