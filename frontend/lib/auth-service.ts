// Authentication Service
import apiClient, { ApiResponse } from './api-client';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  guru?: {
    id: string;
    nip: string;
    nama: string;
    foto?: string;
  };
  siswa?: {
    id: string;
    nis: string;
    nisn: string;
    nama: string;
    foto?: string;
  };
  orangTua?: {
    id: string;
    siswa: {
      nama: string;
      nis: string;
    };
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post('/api/auth/login', credentials);
  }

  // Register
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    return apiClient.post('/api/auth/register', data);
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/api/auth/me');
  }

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post('/api/auth/logout');
  }

  // Store user in localStorage (optional, for client-side persistence)
  setUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Get user from localStorage
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Remove user from localStorage
  removeUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
