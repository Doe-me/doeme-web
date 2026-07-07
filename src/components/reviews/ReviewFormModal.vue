<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-20" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Avaliar {{ reviewedUserName || 'usuário' }}
              </DialogTitle>
              <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Como foi sua experiência com esta doação?
              </p>

              <!-- Star rating -->
              <div class="mt-4">
                <div class="flex items-center space-x-1" role="radiogroup" aria-label="Nota">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    role="radio"
                    :aria-checked="rating === star"
                    :aria-label="`${star} estrela${star > 1 ? 's' : ''}`"
                    @click="rating = star"
                    class="p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <StarIcon
                      class="h-8 w-8 transition-colors"
                      :class="star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-neutral-600'"
                    />
                  </button>
                </div>
              </div>

              <!-- Comment -->
              <div class="mt-4">
                <label for="review-comment" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Comentário (opcional)
                </label>
                <textarea
                  id="review-comment"
                  v-model="comment"
                  rows="3"
                  maxlength="500"
                  placeholder="Conte como foi..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500 dark:text-neutral-500 text-right">{{ comment.length }}/500</p>
              </div>

              <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="button"
                  :disabled="rating === 0 || saving"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="submit"
                >
                  <svg v-if="saving" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ saving ? 'Enviando...' : 'Enviar avaliação' }}
                </button>
                <button
                  type="button"
                  :disabled="saving"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 sm:mt-0 sm:w-auto disabled:opacity-60"
                  @click="close"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import { useReviewsStore } from '@/stores/reviews'
import { useErrorHandler } from '@/utils/errorHandler'

const props = defineProps<{
  open: boolean
  reviewedUserId: number
  donationItemId: number
  reviewedUserName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const reviewsStore = useReviewsStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const rating = ref(0)
const comment = ref('')
const saving = ref(false)

// Reset the form whenever the modal is (re)opened
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    rating.value = 0
    comment.value = ''
  }
})

const close = () => {
  if (!saving.value) emit('close')
}

const submit = async () => {
  if (rating.value === 0) return
  saving.value = true
  try {
    await reviewsStore.createReview({
      reviewed_user_id: props.reviewedUserId,
      donation_item_id: props.donationItemId,
      rating: rating.value,
      comment: comment.value.trim() || undefined,
    })
    toast.success('Avaliação enviada com sucesso!')
    emit('saved')
    emit('close')
  } catch (err) {
    handleError(err, 'Erro ao enviar avaliação')
  } finally {
    saving.value = false
  }
}
</script>
