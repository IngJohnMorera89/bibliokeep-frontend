import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'bk-stats-widget',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-widget.component.html'
})
export class StatsWidgetComponent {
  readonly label = input<string>('Metric');
  readonly value = input<string | number>('0');
  readonly detail = input<string>('Detalles');
}
