import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import { useToast } from 'vue-toastification'
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Category,
  DonationItem,
  Chat,
  ChatMessage,
  Review,
  PaginatedResponse,
  FilterOptions,
  ReviewStats,
  UpdateProfileData
} from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const toast = useToast()
    
    // Handle different error types
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as { errors?: Record<string, string[]>; message?: string }
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            toast.error('Sessão expirada. Faça login novamente.')
            window.location.href = '/login'
          }
          break
          
        case 403:
          toast.error('Você não tem permissão para realizar esta ação.')
          break
          
        case 404:
          toast.error('Recurso não encontrado.')
          break
          
        case 422:
          // Validation errors
          if (data.errors) {
            const firstError = Object.values(data.errors)[0] as string[]
            toast.error(firstError[0])
          } else if (data.message) {
            toast.error(data.message)
          }
          break
          
        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.')
          break
          
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.')
          break
          
        default:
          toast.error(data.message || 'Erro inesperado. Tente novamente.')
      }
    } else if (error.request) {
      // Network error
      toast.error('Erro de conexão. Verifique sua internet.')
    } else {
      // Other error
      toast.error('Erro inesperado. Tente novamente.')
    }
    
    return Promise.reject(error)
  }
)

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse): T => {
  return response.data.data || response.data
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials)
    return handleApiResponse(response)
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data)
    return handleApiResponse(response)
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  getUser: async (): Promise<User> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/user')
    return response.data.user
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response: AxiosResponse<{ user: User }> = await api.put('/auth/profile', data)
    return response.data.user
  },

  updateAddress: async (data: {
    zip_code?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
  }): Promise<User> => {
    const response: AxiosResponse<{ user: User }> = await api.put('/auth/address', data)
    return response.data.user
  },

  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response: AxiosResponse<{ user: User }> = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.user
  },

  changePassword: async (data: { current_password: string; password: string; password_confirmation: string }): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', data)
    return handleApiResponse(response)
  },

  getNotificationPreferences: async (): Promise<Record<string, boolean>> => {
    const response = await api.get('/auth/notification-preferences')
    return response.data.notification_preferences
  },

  updateNotificationPreferences: async (data: Record<string, boolean>): Promise<Record<string, boolean>> => {
    const response = await api.put('/auth/notification-preferences', data)
    return response.data.notification_preferences
  },

  getPrivacySettings: async (): Promise<Record<string, boolean>> => {
    const response = await api.get('/auth/privacy-settings')
    return response.data.privacy_settings
  },

  updatePrivacySettings: async (data: Record<string, boolean>): Promise<Record<string, boolean>> => {
    const response = await api.put('/auth/privacy-settings', data)
    return response.data.privacy_settings
  },

  getConnectedAccounts: async (): Promise<{ google: boolean; facebook: boolean }> => {
    const response = await api.get('/auth/connected-accounts')
    return response.data.connected_accounts
  },

  deleteAccount: async (data: { password: string }): Promise<{ message: string }> => {
    const response = await api.delete('/auth/account', { data })
    return handleApiResponse(response)
  },


  // Social auth
  getSocialAuthUrl: (provider: 'google' | 'facebook'): string => {
    return `${api.defaults.baseURL}/auth/${provider}/redirect`
  },

  // Password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email })
    return handleApiResponse(response)
  },

  resetPassword: async (data: { token: string; email: string; password: string; password_confirmation: string }): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data)
    return handleApiResponse(response)
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (paginate = false): Promise<Category[] | PaginatedResponse<Category>> => {
    const params = paginate ? {} : { paginate: 'false' }
    const response = await api.get('/categories', { params })
    return handleApiResponse(response)
  },

  getById: async (id: number): Promise<Category> => {
    const response: AxiosResponse<{ data: Category }> = await api.get(`/categories/${id}`)
    return handleApiResponse(response)
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response: AxiosResponse<{ data: Category }> = await api.post('/categories', data)
    return handleApiResponse(response)
  },

  update: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response: AxiosResponse<{ data: Category }> = await api.put(`/categories/${id}`, data)
    return handleApiResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}

// Donation Items API
export const donationItemsApi = {
  getAll: async (filters: FilterOptions = {}): Promise<PaginatedResponse<DonationItem>> => {
    const response: AxiosResponse<PaginatedResponse<DonationItem>> = await api.get('/donation-items', {
      params: filters,
    })
    return response.data
  },

  getById: async (id: number): Promise<{ data: DonationItem; related_items: DonationItem[] }> => {
    const response = await api.get(`/donation-items/${id}`)
    return response.data
  },

  create: async (data: FormData | Partial<DonationItem>): Promise<DonationItem> => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    
    const response: AxiosResponse<{ data: DonationItem }> = await api.post('/donation-items', data, config)
    return handleApiResponse(response)
  },

  update: async (id: number, data: FormData | Partial<DonationItem>): Promise<DonationItem> => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    
    const response: AxiosResponse<{ data: DonationItem }> = await api.put(`/donation-items/${id}`, data, config)
    return handleApiResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/donation-items/${id}`)
  },

  getMyDonations: async (filters: FilterOptions = {}): Promise<PaginatedResponse<DonationItem>> => {
    const response: AxiosResponse<PaginatedResponse<DonationItem>> = await api.get('/my-donations', {
      params: filters,
    })
    return response.data
  },

  // Additional endpoints
  markAsReserved: async (id: number): Promise<DonationItem> => {
    const response = await api.post(`/donation-items/${id}/reserve`)
    return handleApiResponse(response)
  },

  cancelReservation: async (id: number): Promise<DonationItem> => {
    const response = await api.post(`/donation-items/${id}/cancel-reservation`)
    return handleApiResponse(response)
  },

  markAsDonated: async (id: number, recipientId: number): Promise<DonationItem> => {
    const response = await api.post(`/donation-items/${id}/donate`, { recipient_id: recipientId })
    return handleApiResponse(response)
  },

  uploadImages: async (id: number, images: File[]): Promise<string[]> => {
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image)
    })
    
    const response = await api.post(`/donation-items/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return handleApiResponse(response)
  },

  deleteImage: async (id: number, imageUrl: string): Promise<void> => {
    await api.delete(`/donation-items/${id}/images`, {
      data: { image_url: imageUrl }
    })
  },
}

// Chat API
export const chatApi = {
  getAll: async (page = 1, perPage = 20): Promise<PaginatedResponse<Chat>> => {
    const response: AxiosResponse<PaginatedResponse<Chat>> = await api.get('/chats', {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  getById: async (id: number): Promise<Chat> => {
    const response = await api.get(`/chats/${id}`)
    return handleApiResponse(response)
  },

  getMessages: async (chatId: number, page = 1, perPage = 50): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await api.get(`/chats/${chatId}/messages`, {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  create: async (data: { donation_item_id: number; message?: string }): Promise<Chat> => {
    const response: AxiosResponse<{ data: Chat }> = await api.post('/chats', data)
    return handleApiResponse(response)
  },

  sendMessage: async (chatId: number, message: string): Promise<ChatMessage> => {
    const response: AxiosResponse<{ data: ChatMessage }> = await api.post(`/chats/${chatId}/messages`, {
      message,
    })
    return handleApiResponse(response)
  },

  markAsRead: async (chatId: number): Promise<void> => {
    await api.post(`/chats/${chatId}/mark-as-read`)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/chats/${id}`)
  },
}

// Reviews API
export const reviewsApi = {
  getAll: async (filters: FilterOptions = {}): Promise<PaginatedResponse<Review>> => {
    const response: AxiosResponse<PaginatedResponse<Review>> = await api.get('/reviews', {
      params: filters,
    })
    return response.data
  },

  getById: async (id: number): Promise<Review> => {
    const response: AxiosResponse<{ data: Review }> = await api.get(`/reviews/${id}`)
    return handleApiResponse(response)
  },

  create: async (data: {
    reviewed_user_id: number;
    donation_item_id: number;
    rating: number;
    comment?: string;
  }): Promise<Review> => {
    const response: AxiosResponse<{ data: Review }> = await api.post('/reviews', data)
    return handleApiResponse(response)
  },

  update: async (id: number, data: { rating: number; comment?: string }): Promise<Review> => {
    const response: AxiosResponse<{ data: Review }> = await api.put(`/reviews/${id}`, data)
    return handleApiResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`)
  },

  getUserReviews: async (userId: number, type: 'received' | 'given' = 'received', page = 1, perPage = 15): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/users/${userId}/reviews`, {
      params: { type, page, per_page: perPage },
    })
    return response.data
  },

  getUserStats: async (userId: number): Promise<ReviewStats> => {
    const response = await api.get(`/users/${userId}/review-stats`)
    return handleApiResponse(response)
  },

  canReview: async (userId: number, donationItemId: number): Promise<{ can_review: boolean; reason?: string }> => {
    const response = await api.get('/reviews/can-review', {
      params: { user_id: userId, donation_item_id: donationItemId }
    })
    return handleApiResponse(response)
  },
}

// Users API
export const usersApi = {
  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return handleApiResponse(response)
  },

  updateAvatar: async (avatar: File): Promise<User> => {
    const formData = new FormData()
    formData.append('avatar', avatar)
    
    const response = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return handleApiResponse(response)
  },
}

// File upload utility
export const uploadApi = {
  uploadFile: async (file: File, type: 'avatar' | 'donation'): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return handleApiResponse(response)
  },
}

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health')
    return handleApiResponse(response)
  },
}

export default api

