import { Injectable } from '@angular/core';
import { metrics } from '../stores/dashboard.store';

@Injectable({ providedIn: 'root' })
export class StatsService {
  readonly metrics = metrics;
}
