import { Injectable } from '@angular/core';

export interface JwtPayload {
  sub?: string;           // Subject (username/email)
  email?: string;         // Email claim
  userId?: string;        // Custom: user ID
  preferences?: string[]; // Custom: user preferences
  annualGoal?: number;    // Custom: annual reading goal
  iat?: number;           // Issued at (seconds)
  exp?: number;           // Expiration time (seconds)
  iss?: string;           // Issuer
  aud?: string;           // Audience
  [key: string]: any;     // Allow additional claims
}

@Injectable({ providedIn: 'root' })
export class JwtDecoderService {
  
  /**
   * Decodes a JWT token and returns the payload
   * IMPORTANT: This does NOT verify the signature.
   * The signature MUST be verified on the backend before using this token.
   */
  decode(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      
      if (!base64Url) {
        console.error('Invalid JWT format: missing payload');
        return null;
      }

      // Replace URL-safe base64 characters with standard base64
      const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Add padding if needed
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

      // Decode from base64
      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  /**
   * Extracts the human-readable username from JWT payload
   */
  getUsername(token: string): string | null {
    const payload = this.decode(token);
    return payload?.email || payload?.sub || null;
  }

  /**
   * Checks if JWT token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decode(token);
      
      if (!payload || !payload.exp) {
        return true;
      }

      // exp is in seconds, Date.now() is in milliseconds
      const expirationTime = payload.exp * 1000;
      const now = Date.now();

      return now > expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Gets time remaining until token expiration (in seconds)
   */
  getTimeUntilExpiration(token: string): number | null {
    try {
      const payload = this.decode(token);
      
      if (!payload || !payload.exp) {
        return null;
      }

      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      const timeRemaining = (expirationTime - now) / 1000;

      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      console.error('Error calculating token expiration:', error);
      return null;
    }
  }

  /**
   * Returns all claims from the JWT payload
   */
  getAllClaims(token: string): JwtPayload | null {
    return this.decode(token);
  }
}
