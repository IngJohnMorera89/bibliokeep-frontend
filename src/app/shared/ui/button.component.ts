import { ChangeDetectionStrategy, Component, EventEmitter, computed, input, output } from '@angular/core';


@Component({
  selector: 'bk-button',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly clicked = output<PointerEvent>();

  readonly buttonClass = computed(() => {
    const base =
      'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50';

    if (this.variant() === 'secondary') {
      return `${base} bg-slate-100 text-slate-950 hover:bg-slate-200`;
    }

    if (this.variant() === 'danger') {
      return `${base} bg-rose-600 text-white hover:bg-rose-700`;
    }

    return `${base} bg-slate-950 text-white hover:bg-slate-800`;
  });
}
