export * from './auth'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface DonationImage {
  id: number
  path: string
  url?: string
}

export interface DonationItem {
  id: number
  user_id: number
  category_id: number
  title: string
  description: string
  images?: string[]
  donation_images?: DonationImage[]
  condition: 'Novo' | 'Usado - Excelente estado' | 'Usado - Bom estado' | 'Usado - Estado regular'
  location: string
  latitude?: number
  longitude?: number
  allow_pickup?: boolean
  allow_delivery?: boolean
  status: 'available' | 'reserved' | 'donated'
  donated_at?: string
  donated_to_user_id?: number
  created_at: string
  updated_at: string
  user?: User
  category?: Category
  donated_to_user?: User
}

export interface Chat {
  id: number
  donation_item_id?: number
  donor_id?: number
  interested_user_id?: number
  last_message_at?: string
  created_at: string
  updated_at: string
  donation_item?: DonationItem
  donor?: User
  interested_user?: User
  unread_count?: number
  // Campos adicionais para a interface
  donationItem: {
    id: number
    title: string
    status: 'available' | 'reserved' | 'donated'
    image?: string
    location?: string
  }
  otherUser: {
    id: number
    name: string
    avatar?: string
    isOnline?: boolean
  }
  lastMessage?: ChatMessage
  unreadCount?: number
}

export interface ChatMessage {
  id: number
  chat_id: number
  user_id: number
  message: string
  read_at?: string
  created_at: string
  updated_at?: string
  user?: User
}

export interface CreateChatRequest {
  donation_item_id: number
  message?: string
}

export interface SendMessageRequest {
  message: string
}
export interface Review {
  id: number
  reviewer_id: number
  reviewed_user_id: number
  donation_item_id: number
  rating: number
  comment?: string
  response?: string
  created_at: string
  updated_at: string
  reviewer?: any
  reviewed_user?: any
  donation_item?: {
    id: number
    title: string
    images: string[]
    user_id?: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
}

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface FilterOptions {
  category_id?: number
  location?: string
  condition?: string
  search?: string
  page?: number
  per_page?: number
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

