import { LoginResponse, RegisterResponse, VerifyEmailResponse } from '@/types/api';

// Configuración de API con fallback robusto
const getApiBaseUrl = () => {
  // Prioridad: variable de entorno > fallback hardcodeado
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const fallbackUrl = 'http://localhost:4000/api';
  
  const apiUrl = envUrl || fallbackUrl;
  
  // Debug logs
  console.log('🔧 Environment API URL:', envUrl);
  console.log('🔧 Final API URL:', apiUrl);
  
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log('Making request to:', fullUrl);
    console.log('Request config:', config);
    
    const response = await fetch(fullUrl, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
      console.error('API Error:', error);
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(nombre: string, email: string, password: string): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return this.request<VerifyEmailResponse>(`/auth/verify/${token}`);
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async resendVerification(email: string) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUserPreferences(preferences: Record<string, unknown>) {
    return this.request('/users/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  // Onboarding endpoints
  async completeOnboarding(data: Record<string, unknown>) {
    return this.request('/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOnboardingStatus() {
    return this.request('/onboarding/status');
  }

  // Chat endpoints
  async getChats() {
    return this.request('/chats');
  }

  async getChat(chatId: string) {
    return this.request(`/chats/${chatId}`);
  }

  async createChat(partner: Record<string, unknown>) {
    return this.request('/chats', {
      method: 'POST',
      body: JSON.stringify({ partner }),
    });
  }

  async deactivateChat(chatId: string) {
    return this.request(`/chats/${chatId}/deactivate`, {
      method: 'PATCH',
    });
  }

  // Message endpoints
  async getMessages(chatId: string) {
    return this.request(`/messages/${chatId}`);
  }

  async sendMessage(chatId: string, sender: string, content: string) {
    return this.request(`/messages/${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ sender, content }),
    });
  }

  async testNewCharacter(chatId: string) {
    return this.request(`/messages/test-new-character/${chatId}`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
