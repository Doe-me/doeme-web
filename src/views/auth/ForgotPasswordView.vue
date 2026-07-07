<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <router-link to="/" class="inline-flex items-center">
          <span class="text-3xl font-display text-brand-600">{{ $t('common.appName') }}</span>
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Recuperar senha</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <!-- Estado enviado -->
      <div
        v-if="sent"
        class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4 text-sm text-green-800 dark:text-green-300"
      >
        Se houver uma conta com esse e-mail, você receberá as instruções de recuperação em instantes.
        Verifique também a caixa de spam.
      </div>

      <form v-else @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            E-mail
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white dark:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="voce@exemplo.com"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-neutral-400">
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Voltar para o login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'

const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const email = ref('')
const loading = ref(false)
const sent = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await authStore.forgotPassword(email.value)
    // Resposta é sempre genérica (não revela se o e-mail existe).
    sent.value = true
  } catch (err) {
    handleError(err, 'Erro ao enviar e-mail de recuperação')
  } finally {
    loading.value = false
  }
}
</script>
