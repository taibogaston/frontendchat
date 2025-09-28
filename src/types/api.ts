// API Response Types
export interface User {
  id: string;
  nombre: string;
  email: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  idioma_principal?: string;
  idioma_objetivo?: string;
  nivel_idioma?: string;
  intereses?: string[];
  pais?: string;
  edad?: number;
  preferencia_genero?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface ApiError {
  error: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
