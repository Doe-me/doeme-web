// Validation utilities for forms and data

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = []

  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(rule.message || 'Este campo é obrigatório')
      continue
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(rule.message || `Mínimo de ${rule.minLength} caracteres`)
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(rule.message || `Máximo de ${rule.maxLength} caracteres`)
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message || 'Formato inválido')
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : (rule.message || 'Valor inválido'))
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Common validation rules
export const validationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || 'Este campo é obrigatório'
  }),

  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || 'Email inválido'
  }),

  password: (message?: string): ValidationRule => ({
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: message || 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'
  }),

  phone: (message?: string): ValidationRule => ({
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message: message || 'Telefone inválido. Use o formato (11) 99999-9999'
  }),

  cpf: (message?: string): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return true
      const cpf = value.replace(/\D/g, '')
      return validateCPF(cpf)
    },
    message: message || 'CPF inválido'
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Mínimo de ${length} caracteres`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Máximo de ${length} caracteres`
  }),

  numeric: (message?: string): ValidationRule => ({
    pattern: /^\d+$/,
    message: message || 'Apenas números são permitidos'
  }),

  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message: message || 'URL inválida'
  }),

  rating: (message?: string): ValidationRule => ({
    custom: (value: number) => {
      return value >= 1 && value <= 5
    },
    message: message || 'Avaliação deve ser entre 1 e 5'
  })
}

// CPF validation
export const validateCPF = (cpf: string): boolean => {
  if (!cpf || cpf.length !== 11) return false
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) return false
  
  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(10))) return false
  
  return true
}

// Form validation helper
export const useFormValidation = () => {
  const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule[]>): {
    isValid: boolean
    errors: Record<string, string[]>
  } => {
    const errors: Record<string, string[]> = {}
    let isValid = true

    for (const [field, fieldRules] of Object.entries(rules)) {
      const result = validateField(data[field], fieldRules)
      if (!result.isValid) {
        errors[field] = result.errors
        isValid = false
      }
    }

    return { isValid, errors }
  }

  return { validateForm }
}

// File validation
export const validateFile = (file: File, options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  maxWidth?: number
  maxHeight?: number
}): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const errors: string[] = []

    // Size validation
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`Arquivo muito grande. Máximo: ${formatFileSize(options.maxSize)}`)
    }

    // Type validation
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`Tipo de arquivo não permitido. Permitidos: ${options.allowedTypes.join(', ')}`)
    }

    // Image dimension validation
    if (file.type.startsWith('image/') && (options.maxWidth || options.maxHeight)) {
      const img = new Image()
      img.onload = () => {
        if (options.maxWidth && img.width > options.maxWidth) {
          errors.push(`Largura máxima: ${options.maxWidth}px`)
        }
        if (options.maxHeight && img.height > options.maxHeight) {
          errors.push(`Altura máxima: ${options.maxHeight}px`)
        }
        
        resolve({
          isValid: errors.length === 0,
          errors
        })
      }
      img.onerror = () => {
        errors.push('Arquivo de imagem inválido')
        resolve({
          isValid: false,
          errors
        })
      }
      img.src = URL.createObjectURL(file)
    } else {
      resolve({
        isValid: errors.length === 0,
        errors
      })
    }
  })
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
}

// Validate coordinates
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

