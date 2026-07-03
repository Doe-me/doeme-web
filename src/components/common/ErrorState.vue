<template>
  <div class="text-center py-12">
    <div class="mx-auto h-24 w-24 text-red-400 mb-4">
      <slot name="icon">
        <svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </slot>
    </div>
    
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title || 'Ops! Algo deu errado' }}
    </h3>

    <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
      {{ description || 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.' }}
    </p>
    
    <div class="space-y-3">
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Tentar Novamente
      </button>
      
      <div v-if="$slots.action">
        <slot name="action"></slot>
      </div>
      
      <router-link
        v-else-if="actionText && actionTo"
        :to="actionTo"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ actionText }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  showRetry?: boolean
  actionText?: string
  actionTo?: string
}

withDefaults(defineProps<Props>(), {
  showRetry: true
})

defineEmits<{
  retry: []
}>()
</script>

