import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isAuthenticated } from '../stores/auth.store';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated es un Signal, así que lo llamamos como función ()
  return authService.isAuthenticated() 
    ? true 
    : router.parseUrl('/login');
}

    export const loginGuard: CanActivateFn = () => {
    
      const router = inject(Router);

      // Si el usuario ya está autenticado, redirigimos al home
     if(isAuthenticated()) {
        return router.parseUrl('/dashboard');
    }
    return true; // Permitimos acceso a la ruta de login
  
};