<template>
  <div class="text-center py-12">
    <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
      <slot name="icon">
        <svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </slot>
    </div>
    
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>

    <p class="text-gray-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
      {{ description }}
    </p>
    
    <div v-if="$slots.action" class="space-y-3">
      <slot name="action"></slot>
    </div>
    
    <router-link
      v-else-if="actionText && actionTo"
      :to="actionTo"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {{ actionText }}
    </router-link>
    
    <button
      v-else-if="actionText && actionClick"
      @click="actionClick"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  actionText?: string
  actionTo?: string
  actionClick?: () => void
}

defineProps<Props>()
</script>

