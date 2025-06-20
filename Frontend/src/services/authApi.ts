
import axios from 'axios';
import { toast } from "sonner";

const API_URL = "http://localhost:3030";

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id?: string;
  username: string;
  email?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<string | null> => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, credentials);
      if (response.data && response.data.token) {
        // Store token in local storage - adjusted to handle token in response object
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('current_user', credentials.username);
        return response.data.token;
      } else if (response.data) {
        // Handle case where token might be directly in the response
        localStorage.setItem('auth_token', response.data);
        localStorage.setItem('current_user', credentials.username);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      return null;
    }
  },
  
  register: async (userData: RegisterData): Promise<User | null> => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Registration failed. Please try again.');
      return null;
    }
  },
  
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_URL}/user/getusers`);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      toast.error('Failed to fetch users.');
      return [];
    }
  },
  
  getCurrentUser: (): string | null => {
    return localStorage.getItem('current_user');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
  
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    toast.info('You have been logged out.');
  }
};
