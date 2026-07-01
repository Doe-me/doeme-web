<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <div v-if="loading" class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

const goToHome = () => router.push('/')
const goToLogin = () => router.push('/auth/login')

onMounted(async () => {
  const { token, error } = route.query

  if (error) {
    success.value = false
    title.value = 'Erro na Autenticação'
    message.value = decodeURIComponent(error as string) || 'Ocorreu um erro durante a autenticação. Tente novamente.'
    toast.error(message.value)
    loading.value = false
    return
  }

  if (!token) {
    success.value = false
    title.value = 'Erro na Autenticação'
    message.value = 'Token de autenticação não encontrado.'
    toast.error(message.value)
    loading.value = false
    return
  }

  try {
    await authStore.setAuthFromToken(token as string)

    success.value = true
    title.value = 'Autenticação Realizada!'
    message.value = 'Você foi autenticado com sucesso. Redirecionando...'
    toast.success('Login realizado com sucesso!')

    setTimeout(() => router.push('/'), 2000)
  } catch {
    success.value = false
    title.value = 'Erro na Autenticação'
    message.value = authStore.error || 'Ocorreu um erro durante a autenticação. Tente novamente.'
    toast.error(message.value)
  } finally {
    loading.value = false
  }
})
</script>
