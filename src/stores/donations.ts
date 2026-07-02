import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { DonationItem, PaginatedResponse, FilterOptions } from '@/types'

export const useDonationsStore = defineStore('donations', () => {
  // State
  const items = ref<DonationItem[]>([])
  const currentItem = ref<DonationItem | null>(null)
  const categoryItems = ref<DonationItem[]>([])
  const userItems = ref<DonationItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  })

  // Getters
  const getItemById = computed(() => {
    return (id: string | number) => items.value.find(item => String(item.id) === String(id))
  })

  const availableItems = computed(() => {
    return items.value.filter(item => item.is_available)
  })

  const hasMoreItems = computed(() => {
    return pagination.value.current_page < pagination.value.last_page
  })

  const hasMoreCategoryItems = computed(() => {
    return categoryItems.value.length > 0 && categoryItems.value.length < pagination.value.total
  })

  // Actions
  const fetchItems = async (filters: FilterOptions = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 12,
        ...filters
      }

      const response = await api.get('/donation-items', { params })
      const data = response.data.data || response.data

      if (filters.page === 1 || !filters.page) {
        items.value = data.data || data
      } else {
        items.value.push(...(data.data || data))
      }

      if (data.current_page) {
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar itens'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchItem = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/donation-items/${id}`)
      currentItem.value = response.data.data || response.data
      
      // Update item in the list if it exists
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = currentItem.value
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar item'
      currentItem.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  const createItem = async (itemData: FormData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/donation-items', itemData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const newItem = response.data.data || response.data
      
      items.value.unshift(newItem)
      return newItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: string, itemData: FormData | object) => {
    loading.value = true
    error.value = null

    try {
      const config = itemData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {}

      const response = await api.put(`/donation-items/${id}`, itemData, config)
      const updatedItem = response.data.data || response.data
      
      // Update in the list
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      // Update current item if it's the same
      if (currentItem.value?.id === id) {
        currentItem.value = updatedItem
      }
      
      return updatedItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/donation-items/${id}`)
      
      // Remove from the list
      items.value = items.value.filter(item => item.id !== id)
      
      // Clear current item if it's the deleted one
      if (currentItem.value?.id === id) {
        currentItem.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryItems = async (categoryId: string, filters: FilterOptions = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        category_id: categoryId,
        page: 1,
        per_page: 12,
        ...filters
      }

      const response = await api.get('/donation-items', { params })
      const data = response.data.data || response.data

      categoryItems.value = data.data || data

      if (data.current_page) {
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar itens da categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadMoreCategoryItems = async (categoryId: string) => {
    if (!hasMoreCategoryItems.value) return

    try {
      const nextPage = Math.floor(categoryItems.value.length / pagination.value.per_page) + 1
      const params = {
        category_id: categoryId,
        page: nextPage,
        per_page: pagination.value.per_page
      }

      const response = await api.get('/donation-items', { params })
      const data = response.data.data || response.data

      categoryItems.value.push(...(data.data || data))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar mais itens'
      throw err
    }
  }

  const fetchUserItems = async (userId?: string) => {
    loading.value = true
    error.value = null

    try {
      const endpoint = userId ? `/users/${userId}/donation-items` : '/user/donation-items'
      const response = await api.get(endpoint)
      const data = response.data.data || response.data

      userItems.value = data.data || data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar itens do usuário'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadMoreItems = async () => {
    if (!hasMoreItems.value) return

    try {
      const nextPage = pagination.value.current_page + 1
      await fetchItems({ page: nextPage })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar mais itens'
      throw err
    }
  }

  const searchItems = async (query: string, filters: FilterOptions = {}) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        search: query,
        page: 1,
        per_page: 12,
        ...filters
      }

      const response = await api.get('/donation-items/search', { params })
      const data = response.data.data || response.data

      items.value = data.data || data

      if (data.current_page) {
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total
        }
      }

      return data.data || data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar itens'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reserveItem = async (id: string) => {
    try {
      const response = await api.post(`/donation-items/${id}/reserve`)
      const updatedItem = response.data.data || response.data
      
      // Update in the list
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      // Update current item if it's the same
      if (currentItem.value?.id === id) {
        currentItem.value = updatedItem
      }
      
      return updatedItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao reservar item'
      throw err
    }
  }

  const cancelReservation = async (id: string) => {
    try {
      const response = await api.post(`/donation-items/${id}/cancel-reservation`)
      const updatedItem = response.data.data || response.data
      
      // Update in the list
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      // Update current item if it's the same
      if (currentItem.value?.id === id) {
        currentItem.value = updatedItem
      }
      
      return updatedItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao cancelar reserva'
      throw err
    }
  }

  const markAsDonated = async (id: string, recipientId: string) => {
    try {
      const response = await api.post(`/donation-items/${id}/donate`, {
        recipient_id: recipientId
      })
      const updatedItem = response.data.data || response.data
      
      // Update in the list
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      // Update current item if it's the same
      if (currentItem.value?.id === id) {
        currentItem.value = updatedItem
      }
      
      return updatedItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao marcar como doado'
      throw err
    }
  }

  const uploadImages = async (itemId: string | number, files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('images[]', file))
    const response = await api.post(`/donation-items/${itemId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data || response.data
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/donation-items/stats')
      return response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar estatísticas'
      throw err
    }
  }

  // Reset state
  const reset = () => {
    items.value = []
    currentItem.value = null
    categoryItems.value = []
    userItems.value = []
    loading.value = false
    error.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0
    }
  }

  return {
    // State
    items,
    currentItem,
    categoryItems,
    userItems,
    loading,
    error,
    pagination,
    
    // Getters
    getItemById,
    availableItems,
    hasMoreItems,
    hasMoreCategoryItems,
    
    // Actions
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    uploadImages,
    deleteItem,
    fetchCategoryItems,
    loadMoreCategoryItems,
    fetchUserItems,
    loadMoreItems,
    searchItems,
    reserveItem,
    cancelReservation,
    markAsDonated,
    fetchStats,
    reset
  }
})

