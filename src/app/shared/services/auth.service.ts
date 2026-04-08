import { Injectable } from '@angular/core';
import { User } from '../../shared/types/user';
import { currentUser, isAuthenticated, setUser } from '../../shared/stores/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = currentUser;
  readonly isAuthenticated = isAuthenticated;

  login(credentials: { email: string; password: string }) {
    const user: User = {
      id: 'user-1',
      email: credentials.email,
      preferences: ['Ficción', 'Historia'],
      annualGoal: 12
    };

    setUser(user);
    return Promise.resolve(user);
  }

  register(payload: { email: string; password: string; preferences?: string[]; annualGoal?: number }) {
    const newUser: User = {
      id: 'user-2',
      email: payload.email,
      preferences: payload.preferences ?? [],
      annualGoal: payload.annualGoal ?? 12
    };

    setUser(newUser);
    return Promise.resolve(newUser);
  }

  logout() {
    setUser(null);
  }

  getToken(): string | null {
    return this.isAuthenticated() ? 'mock-jwt-token' : null;
  }
}
