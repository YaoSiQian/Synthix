// Authentication Types

export interface UserCreateSchema {
  username: string;
  email: string;
  password: string;
}

export interface UserResponseSchema {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string; // ISO datetime
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterForm extends UserCreateSchema {
  confirmPassword: string;
}
