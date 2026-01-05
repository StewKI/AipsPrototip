import type {LoginDto, RegisterDto, User, AuthResponse} from '../types/auth';

const API_BASE_URL = '/api/auth';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(this.formatErrors(errorData));
    }

    return response.json();
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  formatErrors(errors: any): string {
    if (typeof errors === 'string') return errors;
    if (errors.message) return errors.message;
    if (Array.isArray(errors)) {
      return errors.map(e => e.description || e).join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
    return 'An unknown error occurred';
  }
};
