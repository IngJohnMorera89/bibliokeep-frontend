import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JwtDecoderService } from '../services/jwt-decoder.service';

/**
 * EXAMPLE: How to use JWT decoding in components
 * This shows best practices for reading JWT tokens
 */
@Component({
  selector: 'app-jwt-example',
  standalone: true,
  template: `
    <div class="p-4">
      <h3>JWT Token Information</h3>
      
      @if (isAuthenticated()) {
        <div class="space-y-2">
          <p>Token expires in: <strong>{{ timeRemaining() }}s</strong></p>
          <p>Is expiring soon: <strong>{{ isExpiringSoon() }}</strong></p>
          <p>Current user: <strong>{{ currentUser()?.email }}</strong></p>
          
          @if (isExpiringSoon()) {
            <button (click)="refreshToken()" class="px-4 py-2 bg-blue-500 text-white rounded">
              Refresh Token
            </button>
          }
        </div>
      }
    </div>
  `
})
export class JwtExampleComponent implements OnInit {
  private authService = inject(AuthService);
  private jwtDecoder = inject(JwtDecoderService);

  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  timeRemaining = () => this.authService.getAccessTokenExpirationTime() ?? 0;
  isExpiringSoon = () => this.authService.isAccessTokenExpiringSoon();

  ngOnInit() {
    console.log('Access Token:', this.authService.getAccessToken());
    console.log('Token claims:', this.jwtDecoder.getAllClaims(
      this.authService.getAccessToken() || ''
    ));
  }

  async refreshToken() {
    try {
      await this.authService.refreshAccessToken();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }
}

/**
 * IMPORTANT: Backend JWT Payload Requirements
 * 
 * For the frontend decoder to work correctly, the backend should include
 * these claims in the accessToken JWT:
 * 
 * {
 *   "userId": "550e8400-e29b-41d4-a716-446655440000",  // UUID of user
 *   "email": "user@example.com",                         // User email
 *   "sub": "user@example.com",                           // Standard: subject claim
 *   "preferences": ["Fiction", "Science"],               // List of genre preferences
 *   "annualGoal": 12,                                   // Books to read per year
 *   "iat": 1234567890,                                  // Issued at (standards claim)
 *   "exp": 1234568790,                                  // Expiration time (standard claim)
 *   "iss": "bibliokeep",                                // Issuer (optional)
 *   "aud": "bibliokeep-client"                          // Audience (optional)
 * }
 * 
 * Example Spring Boot code to generate this:
 * 
 * public String generateAccessToken(UserDetails user, Map<String, Object> extraClaims) {
 *   var now = Instant.now();
 *   var expiry = now.plus(accessExpirationMinutes, ChronoUnit.MINUTES);
 *   
 *   // Add your custom claims
 *   extraClaims.put("userId", userId);
 *   extraClaims.put("email", user.getUsername());
 *   extraClaims.put("preferences", userPreferences);
 *   extraClaims.put("annualGoal", userAnnualGoal);
 *   
 *   return Jwts.builder()
 *     .subject(user.getUsername())
 *     .claims(extraClaims)
 *     .issuedAt(Date.from(now))
 *     .expiration(Date.from(expiry))
 *     .signWith(getAccessKey())
 *     .compact();
 * }
 */
