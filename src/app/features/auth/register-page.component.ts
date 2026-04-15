
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'bk-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly genres = [
    'Ficción',
    'No Ficción',
    'Historia',
    'Ciencia',
    'Fantasía',
    'Misterio',
    'Poesía',
    'Autoayuda'
  ];

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    preferences: [[] as string[]],
    annualGoal: [12, [Validators.required, Validators.min(1)]]
  });

  readonly selectedPreferences = signal<Set<string>>(new Set());

  togglePreference(genre: string) {
    const updated = new Set(this.selectedPreferences());
    if (updated.has(genre)) {
      updated.delete(genre);
    } else {
      updated.add(genre);
    }
    this.selectedPreferences.set(updated);
    this.form.patchValue({ preferences: Array.from(updated) });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
      preferences: this.form.get('preferences')?.value ?? [],
      annualGoal: this.form.get('annualGoal')?.value ?? 12
    };

    this.authService.register(payload).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
