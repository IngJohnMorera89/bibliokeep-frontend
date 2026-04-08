import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'bk-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly userLabel = computed(() => this.authService.currentUser()?.email ?? 'Invitado');

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
