<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal -->
        <div
          ref="modalRef"
          class="relative bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button
                v-if="showCloseButton"
                @click="$emit('cancel')"
                class="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <div v-if="icon" class="flex items-center mb-4">
              <div :class="iconClass">
                <component :is="icon" class="w-6 h-6" />
              </div>
            </div>
            
            <p class="text-gray-600 dark:text-neutral-400 leading-relaxed">
              {{ message }}
            </p>
            
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 border-t dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
            <button
              @click="$emit('cancel')"
              class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ cancelText }}
            </button>
            
            <button
              @click="$emit('confirm')"
              :disabled="loading"
              :class="confirmButtonClass"
              class="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="loading"
                class="w-4 h-4 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? loadingText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  loading?: boolean
  type?: 'danger' | 'warning' | 'info' | 'success'
  icon?: object
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  loadingText: 'Processando...',
  loading: false,
  type: 'info',
  showCloseButton: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const modalRef = ref<HTMLElement>()

const iconClass = computed(() => {
  const classes = {
    danger: 'flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full',
    warning: 'flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full',
    info: 'flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full',
    success: 'flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
  }
  return classes[props.type]
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('cancel')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

