import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../shared/types/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: { email: string; password: string }) {
    const user: User = {
      id: 'user-1',
      email: credentials.email,
      preferences: ['Ficción', 'Historia'],
      annualGoal: 12
    };

    this.currentUser.set(user);
    return Promise.resolve(user);
  }

  register(payload: { email: string; password: string }) {
    const newUser: User = {
      id: 'user-2',
      email: payload.email,
      preferences: [],
      annualGoal: 12
    };

    this.currentUser.set(newUser);
    return Promise.resolve(newUser);
  }

  logout() {
    this.currentUser.set(null);
  }
}
