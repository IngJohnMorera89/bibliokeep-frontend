import { computed, signal } from '@angular/core';
import { User } from '../../shared/types/user';

// Auth state signals
export const isLoading = signal(false);
export const error = signal<string | null>(null);
export const currentUser = signal<User | null>(null);
export const accessToken = signal<string | null>(null);
export const refreshToken = signal<string | null>(null);

// Computed signals
export const isAuthenticated = computed(() => currentUser() !== null && accessToken() !== null);
export const hasValidAccessToken = computed(() => accessToken() !== null);

// User setters
export const setUser = (user: User | null) => {
  currentUser.set(user);
};

// Token setters
export const setAccessToken = (token: string | null) => {
  accessToken.set(token);
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const setRefreshToken = (token: string | null) => {
  refreshToken.set(token);
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

// Restore tokens from localStorage
export const restoreTokensFromStorage = () => {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');
  
  if (storedAccessToken) {
    accessToken.set(storedAccessToken);
  }
  if (storedRefreshToken) {
    refreshToken.set(storedRefreshToken);
  }
};

// State management
export const setLoading = (loading: boolean) => {
  isLoading.set(loading);
};

export const setError = (err: string | null) => {
  error.set(err);
};

export const clearError = () => {
  error.set(null);
};

// Logout - clears all auth state
export const logout = () => {
  currentUser.set(null);
  accessToken.set(null);
  refreshToken.set(null);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  clearError();
};