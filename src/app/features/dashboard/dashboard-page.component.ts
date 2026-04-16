import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// IMPORTANTE: Se asume que el Store exporta 'books' y 'booksByStatus' como Signals
import * as BookStore from '../../shared/stores/books.store'; 

@Component({
  selector: 'bk-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  
  // Referencias a las Signals del Store
  public readonly allBooks = BookStore.books;
  public readonly stats = BookStore.booksByStatus; 

  // Signals derivadas para las tarjetas de estadísticas
  totalBooks = computed(() => this.allBooks().length);
  readBooks = computed(() => this.stats().leidos || 0);
  readingBooks = computed(() => this.stats().leyendo || 0);
  wishlistBooks = computed(() => this.stats().deseados || 0);
  
  hasData = computed(() => this.totalBooks() > 0);

  /**
   * Configuración del gráfico de Dona
   * Usamos 'as const' para asegurar que el valor sea exactamente 'doughnut'
   * y evitar errores de 'Unknown reference' en el template HTML.
   */
  public chartType = 'doughnut' as const;

  /**
   * Datos del gráfico. 
   * La propiedad 'cutout' se define aquí para que TypeScript lo reconozca
   * correctamente en Chart.js 4.
   */
  public chartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Leídos', 'En lectura', 'Deseados'],
    datasets: [{
      data: [
        this.readBooks(), 
        this.readingBooks(), 
        this.wishlistBooks()
      ],
      backgroundColor: [
        '#10b981', // Emerald 500
        '#f59e0b', // Amber 500
        '#f43f5e'  // Rose 500
      ],
      hoverOffset: 15,
      borderWidth: 0,
      cutout: '75%' // Grosor elegante definido en el dataset
    }]
  }));

  /**
   * Opciones de configuración.
   */
  public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { 
          color: '#94a3b8', 
          font: { 
            size: 12,
            weight: 'bold'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1
      }
    }
  };
}
