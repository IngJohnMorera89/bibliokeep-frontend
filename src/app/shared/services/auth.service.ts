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
  isLoading,
  setLoading,
  setError,
  clearError,
  logout,
  restoreTokensFromStorage,
  setLoading as setAuthLoading
} from '../stores/auth.store';
import { User } from '../types/user';
import { AuthTokenResponse, LoginRequest, RegisterRequest, RefreshRequest } from '../types/auth-response';
import { JwtDecoderService } from './jwt-decoder.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtDecoder = inject(JwtDecoderService);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  // Expose store signals
  readonly currentUser = currentUser;
  readonly isAuthenticated = isAuthenticated;
  readonly accessToken = accessToken;
  readonly refreshToken = refreshToken;

  constructor() {
    // Restore tokens from storage on initialization
    restoreTokensFromStorage();
    // Restore user info from token if available
    this.restoreUserFromToken();
  }

  /**
   * Restores user information from the stored access token
   */
  private restoreUserFromToken(): void {
    const token = accessToken();
    if (token) {
      const user = this.extractUserFromToken(token);
      if (user) {
        setUser(user);
      }
    }
  }

  async login(credentials: { email: string; password: string }): Promise<User> {
    try {
      setAuthLoading(true);
      clearError();

      const request: LoginRequest = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await firstValueFrom(
        this.http.post<AuthTokenResponse>(`${this.apiUrl}/login`, request)
      );

      // Store tokens
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      // Extract user info from access token
      const user = this.extractUserFromToken(response.accessToken);
      
      if (user) {
        setUser(user);
        return user;
      } else {
        // Fallback user object if decoding fails
        const fallbackUser: User = {
          id: 'unknown',
          email: credentials.email,
          preferences: [],
          annualGoal: 12
        };
        setUser(fallbackUser);
        return fallbackUser;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async register(payload: { 
    email: string; 
    password: string; 
    preferences?: string[]; 
    annualGoal?: number 
  }): Promise<User> {
    try {
      setAuthLoading(true);
      clearError();

      const request: RegisterRequest = {
        email: payload.email,
        password: payload.password,
        preferences: payload.preferences,
        annualGoal: payload.annualGoal ?? 12
      };

      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/register`, request)
      );

      // Auto-login after registration
      return this.login({ 
        email: payload.email, 
        password: payload.password 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse';
      setError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async refreshAccessToken(): Promise<AuthTokenResponse> {
    try {
      const currentRefreshToken = refreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const request: RefreshRequest = {
        refreshToken: currentRefreshToken
      };

      const response = await firstValueFrom(
        this.http.post<AuthTokenResponse>(`${this.apiUrl}/refresh`, request)
      );

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      // If refresh fails, logout user
      logout();
      const message = error instanceof Error ? error.message : 'Error al renovar token';
      setError(message);
      throw error;
    }
  }

  logoutUser(): void {
    logout();
  }

  getAccessToken(): string | null {
    return accessToken();
  }

  getRefreshToken(): string | null {
    return refreshToken();
  }

  hasValidAccessToken(): boolean {
    const token = accessToken();
    if (!token) return false;
    return !this.jwtDecoder.isTokenExpired(token);
  }

  /**
   * Extracts user information from the access token JWT payload
   */
  private extractUserFromToken(token: string): User | null {
    try {
      const payload = this.jwtDecoder.getAllClaims(token);
      
      if (!payload) {
        console.warn('Failed to decode JWT payload');
        return null;
      }

      // Build user object from JWT claims
      // Map JWT claims to User interface
      const user: User = {
        id: payload.userId || payload.sub || 'unknown',
        email: payload.email || payload.sub || 'unknown@email.com',
        preferences: payload.preferences || [],
        annualGoal: payload.annualGoal || 12
      };

      return user;
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }

  /**
   * Gets the remaining time until access token expires (in seconds)
   */
  getAccessTokenExpirationTime(): number | null {
    const token = accessToken();
    if (!token) return null;
    return this.jwtDecoder.getTimeUntilExpiration(token);
  }

  /**
   * Checks if the access token will expire soon (within 5 minutes)
   */
  isAccessTokenExpiringSoon(): boolean {
    const timeRemaining = this.getAccessTokenExpirationTime();
    if (timeRemaining === null) return true;
    
    // Consider expiring soon if less than 5 minutes remain
    return timeRemaining < 300;
  }
}
