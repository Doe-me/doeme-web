import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export const useErrorHandler = () => {
  const toast = useToast()

  const handleError = (error: AxiosError | Error, defaultMessage = 'Erro inesperado') => {
    console.error('Error:', error)

    if (error.response) {
      // API error response
      const status = error.response.status
      const data = error.response.data as ApiError

      switch (status) {
        case 400:
          toast.error(data.message || 'Dados inválidos')
          break
        case 401:
          toast.error('Sessão expirada. Faça login novamente.')
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
          } else {
            toast.error(data.message || 'Dados inválidos')
          }
          break
        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.')
          break
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.')
          break
        default:
          toast.error(data.message || defaultMessage)
      }
    } else if (error.request) {
      // Network error
      toast.error('Erro de conexão. Verifique sua internet.')
    } else if (error.message) {
      // Other error with message
      toast.error(error.message)
    } else {
      // Unknown error
      toast.error(defaultMessage)
    }
  }

  const getErrorMessage = (error: AxiosError | Error, defaultMessage = 'Erro inesperado'): string => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0] as string[]
      return firstError[0]
    }
    
    if (error.message) {
      return error.message
    }
    
    return defaultMessage
  }

  const getValidationErrors = (error: AxiosError | Error): Record<string, string[]> | null => {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      return error.response.data.errors
    }
    return null
  }

  return {
    handleError,
    getErrorMessage,
    getValidationErrors
  }
}

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandler = () => {
  const { handleError } = useErrorHandler()

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    handleError(event.reason, 'Erro inesperado na aplicação')
  })

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    handleError(event.error, 'Erro inesperado na aplicação')
  })
}

// Retry utility for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i === maxRetries) {
        throw error
      }
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  throw lastError
}

// Loading state manager
export const useLoadingState = () => {
  const loadingStates = new Map<string, boolean>()

  const setLoading = (key: string, loading: boolean) => {
    loadingStates.set(key, loading)
  }

  const isLoading = (key: string): boolean => {
    return loadingStates.get(key) || false
  }

  const isAnyLoading = (): boolean => {
    return Array.from(loadingStates.values()).some(loading => loading)
  }

  return {
    setLoading,
    isLoading,
    isAnyLoading
  }
}

