<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <router-link to="/" class="inline-flex items-center">
          <span class="text-3xl font-display text-brand-600">{{ $t('common.appName') }}</span>
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Redefinir senha</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">Escolha uma nova senha para sua conta.</p>
      </div>

      <!-- Link inválido -->
      <div
        v-if="!token || !email"
        class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 text-sm text-red-800 dark:text-red-300"
      >
        Link de recuperação inválido ou incompleto.
        <router-link to="/forgot-password" class="font-medium underline">Solicitar um novo link.</router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">E-mail</label>
          <input
            id="email"
            :value="email"
            type="email"
            disabled
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 rounded-lg sm:text-sm"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Nova senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white dark:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Mínimo de 8 caracteres"
          />
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Confirmar nova senha</label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            autocomplete="new-password"
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white dark:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Repita a nova senha"
          />
          <p v-if="passwordConfirmation && password !== passwordConfirmation" class="mt-1 text-sm text-red-600">
            As senhas não conferem.
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || password !== passwordConfirmation"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Redefinindo...' : 'Redefinir senha' }}
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
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

// token e email vêm da query string do link enviado por e-mail
const token = ref((route.query.token as string) || '')
const email = ref((route.query.email as string) || '')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) return
  loading.value = true
  try {
    await authStore.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    toast.success('Senha redefinida com sucesso! Faça login com a nova senha.')
    router.push('/login')
  } catch (err) {
    handleError(err, 'Não foi possível redefinir a senha. O link pode ter expirado.')
  } finally {
    loading.value = false
  }
}
</script>
