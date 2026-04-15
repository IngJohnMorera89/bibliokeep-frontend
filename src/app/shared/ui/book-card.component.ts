
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Book } from '../types/book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bk-book-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-card.component.html'
})
export class BookCardComponent {
  readonly book = input<Book>();
  readonly selected = output<MouseEvent>();
}
