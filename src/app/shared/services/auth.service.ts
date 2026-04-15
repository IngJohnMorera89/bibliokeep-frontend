import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  currentUser, 
  isAuthenticated, 
  setUser, 
  accessToken,
  refreshToken,
  setAccessToken,
  setRefreshToken,
  clearError,
  logout,
  restoreTokensFromStorage,
  setLoading
} from '../stores/auth.store';
import { User } from '../types/user';
import { AuthTokenResponse, LoginRequest, RegisterRequest, RefreshRequest } from '../types/auth-response';
import { JwtDecoderService } from './jwt-decoder.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtDecoder = inject(JwtDecoderService);
  private readonly apiUrl = `${environment.backendUrl}api/auth`;

  // Exponer los Signals del Store para que los componentes los consuman directamente
  readonly currentUser = currentUser;
  readonly isAuthenticated = isAuthenticated;
  readonly accessToken = accessToken;
  readonly refreshToken = refreshToken;

  constructor() {
    // 1. Al iniciar el servicio, recuperamos tokens de localStorage (si existen)
    restoreTokensFromStorage();
    // 2. Si recuperamos un token, extraemos al usuario para mantener la sesión activa al recargar
    this.restoreUserFromToken();
    console.log('Backend URL configurada:', environment.backendUrl);
  console.log('API URL construida:', this.apiUrl);
  restoreTokensFromStorage();
  this.restoreUserFromToken();
  }
 

  /**
   * Intenta restaurar la información del usuario si hay un token válido en el store
   */
  private restoreUserFromToken(): void {
    const token = accessToken();
    if (token && !this.jwtDecoder.isTokenExpired(token)) {
      const user = this.extractUserFromToken(token);
      if (user) setUser(user);
    } else if (token) {
      // Si el token existe pero expiró al recargar, forzamos logout o intento de refresh
      this.logout();
    }
  }

  /**
   * Inicio de sesión
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      setLoading(true);
      clearError();

      const response = await firstValueFrom(
        this.http.post<AuthTokenResponse>(`${this.apiUrl}/login`, credentials)
      );

      // Guardar tokens en el Store (y por ende en LocalStorage mediante el store)
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      const user = this.extractUserFromToken(response.accessToken);
      
      if (!user) {
        throw new Error('No se pudo extraer la información del usuario del token');
      }

      setUser(user);
      return user;
    } catch (error: any) {
      // El error lo manejamos aquí para el componente, pero el store también puede trackearlo
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Registro de usuario con login automático
   */
  async register(payload: RegisterRequest): Promise<User> {
    try {
      setLoading(true);
      clearError();

      // El backend devuelve 201 Created (void o el usuario creado)
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/register`, payload)
      );

      // Login automático tras registro exitoso
      return this.login({ 
        email: payload.email, 
        password: payload.password 
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Refresco de Token (Usado por el Interceptor)
   */
  async refreshAccessToken(): Promise<AuthTokenResponse> {
    const currentRefreshToken = refreshToken();
    
    if (!currentRefreshToken) {
      this.logout();
      throw new Error('Sesión expirada');
    }

    const request: RefreshRequest = { refreshToken: currentRefreshToken };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthTokenResponse>(`${this.apiUrl}/refresh`, request)
      );

      setAccessToken(response.accessToken);
      // Actualizamos el refresh token si el backend envía uno nuevo (Rotate)
      setRefreshToken(response.refreshToken); 

      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Cierre de sesión centralizado
   */
  logout(): void {
    logout(); // Limpia signals y storage a través del store
  }

  /**
   * Extrae los claims del JWT y los mapea a la interfaz User
   */
  private extractUserFromToken(token: string): User | null {
    try {
      const payload = this.jwtDecoder.getAllClaims(token);
      
      if (!payload) return null;

      // Mapeo exacto según los claims que configuramos en el backend (AuthServiceImpl.java)
      return {
        id: payload.userId || 'unknown',
        email: payload.email || 'unknown',
        preferences: payload.preferences || [],
        annualGoal: payload.annualGoal || 0
      };
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  /**
   * Helpers de utilidad para Guards e Interceptors
   */
  hasValidAccessToken(): boolean {
    const token = accessToken();
    return !!token && !this.jwtDecoder.isTokenExpired(token);
  }

  isAccessTokenExpiringSoon(thresholdSeconds: number = 300): boolean {
    const token = accessToken();
    if (!token) return true;
    const timeRemaining = this.jwtDecoder.getTimeUntilExpiration(token);
    return timeRemaining !== null && timeRemaining < thresholdSeconds;
  }
}