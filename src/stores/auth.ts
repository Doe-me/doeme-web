import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, usersApi } from '@/services/api'
import type { User, LoginCredentials, RegisterData, UpdateProfileData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoading = computed(() => loading.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return ''
    return user.value.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authApi.login(credentials)
      
      // Store token and user data
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authApi.register(data)
      
      // Store token and user data
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar conta'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      
      // Call API logout if token exists
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      // Clear local state regardless of API call result
      user.value = null
      token.value = null
      error.value = null
      loading.value = false
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  const fetchUser = async () => {
    try {
      loading.value = true
      error.value = null
      
      const userData = await authApi.getUser()
      user.value = userData
      
      localStorage.setItem('user', JSON.stringify(userData))
      
      return userData
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar dados do usuário'
      
      // If unauthorized, clear auth data
      if (err.response?.status === 401) {
        await logout()
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      loading.value = true
      error.value = null
      
      const updatedUser = await authApi.updateProfile(data)
      user.value = updatedUser
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return updatedUser
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAvatar = async (avatar: File) => {
    try {
      loading.value = true
      error.value = null
      
      const updatedUser = await usersApi.updateAvatar(avatar)
      user.value = updatedUser
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return updatedUser
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar avatar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authApi.forgotPassword(email)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao enviar email de recuperação'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authApi.resetPassword(data)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao redefinir senha'
      throw err
    } finally {
      loading.value = false
    }
  }

  const handleSocialCallback = async (provider: string, code: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await authApi.handleSocialCallback(provider, code)
      
      // Store token and user data
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro na autenticação social'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSocialAuthUrl = (provider: 'google' | 'facebook'): string => {
    return authApi.getSocialAuthUrl(provider)
  }

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<void> => {
    try {
      // Redirecionar para o endpoint de OAuth
      window.location.href = getSocialAuthUrl(provider)
    } catch (err) {
      error.value = err.response?.data?.message || `Erro ao fazer login com ${provider}`
      throw err
    }
  }

  const initializeAuth = async () => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        
        // Verify token is still valid by fetching user data
        await fetchUser()
      } catch {
        // Token is invalid, clear auth data
        await logout()
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const changePassword = async (data: Parameters<typeof authApi.changePassword>[0]) => {
    try {
      loading.value = true
      error.value = null
      return await authApi.changePassword(data)
    } catch (err) {
      error.value = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao alterar senha'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getNotificationPreferences = async () => {
    try {
      return await authApi.getNotificationPreferences()
    } catch (err) {
      throw err
    }
  }

  const updateNotificationPreferences = async (data: Record<string, boolean>) => {
    try {
      loading.value = true
      return await authApi.updateNotificationPreferences(data)
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPrivacySettings = async () => {
    try {
      return await authApi.getPrivacySettings()
    } catch (err) {
      throw err
    }
  }

  const updatePrivacySettings = async (data: Record<string, boolean>) => {
    try {
      loading.value = true
      return await authApi.updatePrivacySettings(data)
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const getConnectedAccounts = async () => {
    try {
      return await authApi.getConnectedAccounts()
    } catch (err) {
      throw err
    }
  }

  const deleteAccount = async (data: { password: string }) => {
    try {
      loading.value = true
      await authApi.deleteAccount(data)
      clearAuth()
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    isLoading,
    userInitials,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    updateAvatar,
    changePassword,
    getNotificationPreferences,
    updateNotificationPreferences,
    getPrivacySettings,
    updatePrivacySettings,
    getConnectedAccounts,
    deleteAccount,
    forgotPassword,
    resetPassword,
    handleSocialCallback,
    getSocialAuthUrl,
    socialLogin,
    initializeAuth,
    clearError,
    clearAuth
  }
})

