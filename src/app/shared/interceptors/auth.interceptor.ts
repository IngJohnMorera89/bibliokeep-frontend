import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken(); // Usamos el signal directamente

  let authReq = req;

  // 1. Añadir el header si existe el token
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // 2. Si obtenemos un 401 y no es la petición de login o refresh
      const isAuthPath = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh');
      
      if (error.status === 401 && !isAuthPath && authService.refreshToken()) {
        
        // Intentamos refrescar el token
        return from(authService.refreshAccessToken()).pipe(
          switchMap((response) => {
            // Reintentamos la petición original con el nuevo token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Si el refresh también falla, limpiamos todo
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Si es otro error o falló la autenticación base, lo lanzamos
      return throwError(() => error);
    })
  );
};