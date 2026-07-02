import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Category } from '@/types'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getCategoryById = computed(() => {
    return (id: string) => categories.value.find(category => category.id === id)
  })

  const popularCategories = computed(() => {
    return categories.value
      .filter(category => category.items_count > 0)
      .sort((a, b) => b.items_count - a.items_count)
      .slice(0, 6)
  })

  const activeCategories = computed(() => {
    return categories.value.filter(category => category.is_active)
  })

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/categories')
      categories.value = response.data.data || response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar categorias'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategory = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/categories/${id}`)
      currentCategory.value = response.data.data || response.data
      
      // Update category in the list if it exists
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = currentCategory.value
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar categoria'
      currentCategory.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/categories', categoryData)
      const newCategory = response.data.data || response.data
      
      categories.value.push(newCategory)
      return newCategory
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/categories/${id}`, categoryData)
      const updatedCategory = response.data.data || response.data
      
      // Update in the list
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      
      // Update current category if it's the same
      if (currentCategory.value?.id === id) {
        currentCategory.value = updatedCategory
      }
      
      return updatedCategory
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/categories/${id}`)
      
      // Remove from the list
      categories.value = categories.value.filter(cat => cat.id !== id)
      
      // Clear current category if it's the deleted one
      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao excluir categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchCategories = async (query: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/categories/search`, {
        params: { q: query }
      })
      return response.data.data || response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao buscar categorias'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryStats = async (id: string) => {
    try {
      const response = await api.get(`/categories/${id}/stats`)
      return response.data.data || response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar estatísticas'
      throw err
    }
  }

  // Reset state
  const reset = () => {
    categories.value = []
    currentCategory.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    categories,
    currentCategory,
    loading,
    error,
    
    // Getters
    getCategoryById,
    popularCategories,
    activeCategories,
    
    // Actions
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    getCategoryStats,
    reset
  }
})

