export interface User {
  userId: string;
  userName: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  userId: string;
  userName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
}
