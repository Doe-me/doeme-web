<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <svg v-if="loading" class="animate-spin w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <CheckCircleIcon v-else-if="success" class="w-8 h-8 text-green-600" />
          <XCircleIcon v-else class="w-8 h-8 text-red-600" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ title }}
        </h1>
        
        <p class="text-gray-600">
          {{ message }}
        </p>
      </div>

      <div v-if="!loading" class="space-y-4">
        <button
          v-if="success"
          @click="goToHome"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Ir para o Início
        </button>
        
        <button
          v-else
          @click="goToLogin"
          class="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const success = ref(false)
const title = ref('Processando...')
const message = ref('Aguarde enquanto processamos sua autenticação.')

const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/auth/login')
}

onMounted(async () => {
  try {
    const { code, state, error, error_description } = route.query
    
    if (error) {
      throw new Error(error_description as string || 'Erro na autenticação social')
    }
    
    if (!code) {
      throw new Error('Código de autorização não encontrado')
    }
    
    // Determinar o provider baseado no state ou rota
    const provider = (state as string)?.includes('google') ? 'google' : 'facebook'
    
    await authStore.handleSocialCallback(provider, {
      code: code as string,
      state: state as string
    })
    
    success.value = true
    title.value = 'Autenticação Realizada!'
    message.value = 'Você foi autenticado com sucesso. Redirecionando...'
    
    toast.success('Login realizado com sucesso!')
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/')
    }, 2000)
    
  } catch (error) {
    success.value = false
    title.value = 'Erro na Autenticação'
    message.value = error.message || 'Ocorreu um erro durante a autenticação. Tente novamente.'
    
    toast.error(error.message || 'Erro na autenticação social')
  } finally {
    loading.value = false
  }
})
</script>
