import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define user roles
export type UserRole = 'tech' | 'receptionist' | 'doctor' | 'admin';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define auth store state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

/**
 * Authentication store using Zustand with persistence
 * Handles user authentication state and provides login/logout methods
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          // In a real implementation, this would be an API call
          // For demonstration purposes, we're using mock data
          
          // Mocked authentication logic
          if (email && password) {
            // Simulate successful login
            set({
              user: {
                id: '1',
                name: 'Usuário Teste',
                email,
                role: 'tech',
              },
              token: 'mock-jwt-token',
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);