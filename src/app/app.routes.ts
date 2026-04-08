import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'library',
    canActivate: [authGuard],
    loadComponent: () => import('./features/books/library-page.component').then((m) => m.LibraryPageComponent)
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./features/books/book-search-page.component').then((m) => m.BookSearchPageComponent)
  },
  {
    path: 'loans',
    canActivate: [authGuard],
    loadComponent: () => import('./features/loans/loans-page.component').then((m) => m.LoansPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register-page.component').then((m) => m.RegisterPageComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
