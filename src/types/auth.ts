export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  average_rating?: number
  total_reviews?: number
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  location?: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type: string
  message: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  phone?: string
  location?: string
  avatar?: string
}

