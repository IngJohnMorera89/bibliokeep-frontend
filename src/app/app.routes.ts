import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './shared/guards/auth.guard'; // Importamos ambos

export const routes: Routes = [
  // Redirección inicial: Si entra a la raíz, lo mandamos al dashboard
  // El authGuard se encargará de decidir si lo deja pasar o lo manda al login
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  
  // Rutas de Autenticación (Protegidas por loginGuard)
  {
    path: 'login',
    canActivate: [loginGuard], // Si ya está logueado, rebota al Dashboard
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: 'register',
    canActivate: [loginGuard], // Evita que un usuario logueado cree otra cuenta
    loadComponent: () => import('./features/auth/register-page.component').then((m) => m.RegisterPageComponent)
  },

  // Rutas Protegidas (Agrupadas)
  {
    path: '',
    canActivate: [authGuard], // Verifica que el usuario tenga sesión activa
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
      },
      {
        path: 'library',
        loadComponent: () => import('./features/books/library-page.component').then((m) => m.LibraryPageComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./features/books/book-search-page.component').then((m) => m.BookSearchPageComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/loans/loans-page.component').then((m) => m.LoansPageComponent)
      }
    ]
  },

  // Comodín: Cualquier ruta no encontrada redirige al dashboard (o al login vía guard)
  { path: '**', redirectTo: 'dashboard' }
];