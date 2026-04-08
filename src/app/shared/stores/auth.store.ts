import { computed, signal } from '@angular/core';
import { User } from '../../shared/types/user';

export const currentUser = signal<User | null>(null);
export const isAuthenticated = computed(() => currentUser() !== null);

export const setUser = (user: User | null) => {
  currentUser.set(user);
};