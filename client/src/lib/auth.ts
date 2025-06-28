export interface AuthUser {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

class AuthManager {
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    this.token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');
    this.user = userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!(this.token && this.user);
  }

  setAuth(authResponse: AuthResponse): void {
    this.token = authResponse.token;
    this.user = authResponse.user;
    localStorage.setItem('auth-token', authResponse.token);
    localStorage.setItem('auth-user', JSON.stringify(authResponse.user));
  }

  clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.token) return {};
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }
}

export const authManager = new AuthManager();
