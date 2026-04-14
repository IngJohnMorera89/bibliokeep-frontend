import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated es un Signal, así que lo llamamos como función ()
  return authService.isAuthenticated() 
    ? true 
    : router.parseUrl('/login');
};