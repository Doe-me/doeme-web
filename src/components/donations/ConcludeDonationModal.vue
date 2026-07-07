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
                Concluir doação
              </DialogTitle>
              <p class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Escolha quem recebeu "{{ item?.title }}". O item será marcado como doado.
              </p>

              <!-- Loading candidates -->
              <div v-if="loading" class="flex justify-center py-8">
                <LoadingSpinner />
              </div>

              <!-- No candidates -->
              <div v-else-if="candidates.length === 0" class="py-6 text-center">
                <p class="text-sm text-gray-600 dark:text-neutral-400">
                  Ninguém iniciou uma conversa sobre este item ainda. Quando alguém demonstrar
                  interesse pelo chat, você poderá concluir a doação para essa pessoa.
                </p>
              </div>

              <!-- Candidate list -->
              <div v-else class="mt-4 space-y-2 max-h-72 overflow-y-auto" role="radiogroup" aria-label="Recebedor">
                <label
                  v-for="candidate in candidates"
                  :key="candidate.id"
                  class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors"
                  :class="selectedId === candidate.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'"
                >
                  <input
                    type="radio"
                    name="recipient"
                    :value="candidate.id"
                    v-model="selectedId"
                    class="text-primary-600 focus:ring-primary-500"
                  />
                  <img
                    :src="candidate.avatar || '/default-avatar.png'"
                    :alt="candidate.name"
                    class="w-9 h-9 rounded-full object-cover"
                  />
                  <span class="font-medium text-gray-900 dark:text-white">{{ candidate.name }}</span>
                </label>
              </div>

              <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  v-if="candidates.length > 0"
                  type="button"
                  :disabled="selectedId === null || saving"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="confirm"
                >
                  <svg v-if="saving" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ saving ? 'Concluindo...' : 'Marcar como doado' }}
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
import { useToast } from 'vue-toastification'
import { useChatsStore } from '@/stores/chats'
import { useDonationsStore } from '@/stores/donations'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { DonationItem, User } from '@/types'

const props = defineProps<{
  open: boolean
  item: DonationItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'done'): void
}>()

const chatsStore = useChatsStore()
const donationsStore = useDonationsStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(false)
const saving = ref(false)
const candidates = ref<User[]>([])
const selectedId = ref<number | null>(null)

watch(() => props.open, async (isOpen) => {
  if (isOpen && props.item) {
    selectedId.value = null
    await loadCandidates(props.item.id)
  }
})

const loadCandidates = async (itemId: number) => {
  loading.value = true
  candidates.value = []
  try {
    await chatsStore.fetchChats()
    // Chats deste item onde o usuário é o doador → interessados são recebedores potenciais.
    const seen = new Set<number>()
    const list: User[] = []
    for (const chat of chatsStore.chats) {
      if (chat.donation_item_id !== itemId) continue
      const interested = chat.interested_user
      if (interested && !seen.has(interested.id)) {
        seen.add(interested.id)
        list.push(interested)
      }
    }
    candidates.value = list
  } catch (err) {
    handleError(err, 'Erro ao carregar interessados')
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (!saving.value) emit('close')
}

const confirm = async () => {
  if (selectedId.value === null || !props.item) return
  saving.value = true
  try {
    await donationsStore.markAsDonated(String(props.item.id), String(selectedId.value))
    toast.success('Doação concluída! 🎉')
    emit('done')
    emit('close')
  } catch (err) {
    handleError(err, 'Erro ao concluir doação')
  } finally {
    saving.value = false
  }
}
</script>
