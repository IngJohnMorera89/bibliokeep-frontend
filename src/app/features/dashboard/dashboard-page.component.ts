import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStoreService } from '../../shared/services/book-store.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'bk-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  public readonly bookStore = inject(BookStoreService);

  // Signals de estadísticas
  totalBooks = computed(() => this.bookStore.books().length);
  readBooks = computed(() => this.bookStore.books().filter(b => b.status === 'LEIDO').length);
  readingBooks = computed(() => this.bookStore.books().filter(b => b.status === 'LEYENDO').length);
  wishlistBooks = computed(() => this.bookStore.books().filter(b => b.status === 'DESEADO').length);
  hasData = computed(() => this.totalBooks() > 0);

  // Configuración del gráfico
  public chartType: ChartType = 'doughnut';

  // Opción segura: mover cutout al dataset para evitar errores de tipado profundo
  public chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['Leídos', 'En lectura', 'Deseados'],
  datasets: [{
    data: [this.readBooks(), this.readingBooks(), this.wishlistBooks()],
    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
    hoverOffset: 15,
    borderWidth: 0,
    cutout: '70%' // <--- Al ponerlo aquí, desaparece el error del TS
  }]
}));

// 2. Configuramos las opciones (Limpias, sin cutout aquí)
public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { color: '#94a3b8', font: { size: 14 } }
    }
  }
};
}
