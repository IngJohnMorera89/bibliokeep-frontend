import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StatsService } from '../../shared/services/stats.service';
import { StatsWidgetComponent } from '../../shared/ui/stats-widget.component';

@Component({
  selector: 'bk-dashboard-page',
  standalone: true,
  imports: [CommonModule, StatsWidgetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  readonly stats = inject(StatsService);
}
