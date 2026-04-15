import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// IMPORTANTE: Asegúrate de que esta ruta sea la correcta en tu proyecto.
// Si el archivo se llama 'book.store.ts', cámbialo aquí abajo.
import * as BookStore from '../../shared/stores/books.store'; 

@Component({
  selector: 'bk-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  
  // Usamos directamente las Signals exportadas del Store para evitar redundancia
  public readonly allBooks = BookStore.books;
  public readonly stats = BookStore.booksByStatus; // Usamos el computed que creamos

  // Signals de estadísticas derivadas del Store
  totalBooks = computed(() => this.allBooks().length);
  
  // Estas señales ahora leen directamente del objeto 'stats' para ser más eficientes
  readBooks = computed(() => this.stats().leidos);
  readingBooks = computed(() => this.stats().leyendo);
  wishlistBooks = computed(() => this.stats().deseados);
  
  hasData = computed(() => this.totalBooks() > 0);

  // Configuración del gráfico de Dona
  public chartType: ChartType = 'doughnut';

  // El gráfico se actualizará automáticamente cuando cambie el Store
  public chartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Leídos', 'En lectura', 'Deseados'],
    datasets: [{
      data: [
        this.readBooks(), 
        this.readingBooks(), 
        this.wishlistBooks()
      ],
      backgroundColor: [
        '#10b981', // Emerald 500 (Leídos)
        '#f59e0b', // Amber 500 (Leyendo)
        '#f43f5e'  // Rose 500 (Deseados)
      ],
      hoverOffset: 15,
      borderWidth: 0,
      cutout: '75%' 
    }]
  }));

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
        backgroundColor: '#1f2937', // Fondo oscuro para el tooltip
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1
      }
    }
  };
}
