import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Review, ReviewStats, PaginatedResponse } from '@/types'

export interface CreateReviewRequest {
  reviewed_user_id: number
  donation_item_id: number
  rating: number
  comment?: string
}

export interface UpdateReviewRequest {
  rating: number
  comment?: string
}

export const useReviewsStore = defineStore('reviews', () => {
  // State
  const reviews = ref<Review[]>([])
  const userReviews = ref<Review[]>([])
  const currentReview = ref<Review | null>(null)
  const reviewStats = ref<ReviewStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  // Getters
  const getReviewById = computed(() => {
    return (id: number) => reviews.value.find(review => review.id === id)
  })

  const getReviewsByUser = computed(() => {
    return (userId: number) => reviews.value.filter(review => review.reviewed_user_id === userId)
  })

  const getReviewsByReviewer = computed(() => {
    return (reviewerId: number) => reviews.value.filter(review => review.reviewer_id === reviewerId)
  })

  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.value.length
  })

  // Actions
  const fetchReviews = async (params: {
    user_id?: number
    reviewer_id?: number
    page?: number
    per_page?: number
  } = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/reviews', { params })
      const data = response.data as PaginatedResponse<Review>
      
      if (params.page === 1) {
        reviews.value = data.data
      } else {
        reviews.value.push(...data.data)
      }
      
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total
      }
      
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar avaliações'
      console.error('Erro ao buscar avaliações:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserReviews = async (userId: number, page = 1) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/users/${userId}/reviews`, {
        params: { page, per_page: 10 }
      })
      
      const data = response.data as PaginatedResponse<Review>
      
      if (page === 1) {
        userReviews.value = data.data
      } else {
        userReviews.value.push(...data.data)
      }
      
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar avaliações do usuário'
      console.error('Erro ao buscar avaliações do usuário:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchReviewStats = async (userId: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/users/${userId}/review-stats`)
      reviewStats.value = response.data.data || response.data
      
      return reviewStats.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar estatísticas de avaliações'
      console.error('Erro ao buscar estatísticas:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchReviewById = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/reviews/${id}`)
      currentReview.value = response.data.data || response.data
      
      return currentReview.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar avaliação'
      console.error('Erro ao buscar avaliação:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReview = async (data: CreateReviewRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/reviews', data)
      const newReview = response.data.data || response.data
      
      reviews.value.unshift(newReview)
      
      return newReview
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar avaliação'
      console.error('Erro ao criar avaliação:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReview = async (id: number, data: UpdateReviewRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/reviews/${id}`, data)
      const updatedReview = response.data.data || response.data
      
      // Atualizar na lista
      const index = reviews.value.findIndex(review => review.id === id)
      if (index !== -1) {
        reviews.value[index] = updatedReview
      }
      
      // Atualizar review atual
      if (currentReview.value?.id === id) {
        currentReview.value = updatedReview
      }
      
      return updatedReview
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar avaliação'
      console.error('Erro ao atualizar avaliação:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReview = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      await api.delete(`/reviews/${id}`)
      
      // Remover da lista
      reviews.value = reviews.value.filter(review => review.id !== id)
      userReviews.value = userReviews.value.filter(review => review.id !== id)
      
      // Limpar review atual se for o mesmo
      if (currentReview.value?.id === id) {
        currentReview.value = null
      }
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir avaliação'
      console.error('Erro ao excluir avaliação:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const canReviewUser = async (userId: number, donationItemId: number) => {
    try {
      const response = await api.get(`/reviews/can-review`, {
        params: { user_id: userId, donation_item_id: donationItemId }
      })
      
      return response.data.can_review || false
    } catch (err: any) {
      console.error('Erro ao verificar se pode avaliar:', err)
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentReview = () => {
    currentReview.value = null
  }

  const clearReviews = () => {
    reviews.value = []
    userReviews.value = []
    reviewStats.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    }
  }

  return {
    // State
    reviews,
    userReviews,
    currentReview,
    reviewStats,
    loading,
    error,
    pagination,
    
    // Getters
    getReviewById,
    getReviewsByUser,
    getReviewsByReviewer,
    averageRating,
    
    // Actions
    fetchReviews,
    fetchUserReviews,
    fetchReviewStats,
    fetchReviewById,
    createReview,
    updateReview,
    deleteReview,
    canReviewUser,
    clearError,
    clearCurrentReview,
    clearReviews
  }
})

