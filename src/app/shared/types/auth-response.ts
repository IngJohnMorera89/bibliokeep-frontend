export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  preferences?: string[];
  annualGoal?: number;
}

export interface RefreshRequest {
  refreshToken: string;
}
