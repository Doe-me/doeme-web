<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="xl" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <ErrorState
        :description="error"
        @retry="loadDonation"
      />
    </div>

    <!-- Main Content -->
    <div v-else-if="donation" class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        @click="$router.go(-1)"
        class="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
        Voltar
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Image Gallery -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                :src="currentImage"
                :alt="donation.title"
                class="w-full h-96 object-cover"
              />
            </div>

            <!-- Image Thumbnails -->
            <div v-if="allImages.length > 1" class="p-4">
              <div class="flex space-x-2 overflow-x-auto">
                <button
                  v-for="(image, index) in allImages"
                  :key="index"
                  @click="currentImage = image"
                  :class="[
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    currentImage === image ? 'border-primary-500' : 'border-gray-200'
                  ]"
                >
                  <img :src="image" :alt="`Imagem ${index + 1}`" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Donation Info -->
        <div class="space-y-6">
          <!-- Main Info Card -->
          <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ donation.title }}</h1>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusClasses[donation.status]
                  ]"
                >
                  {{ statusLabels[donation.status] }}
                </span>
              </div>
              <button
                @click="toggleFavorite"
                :class="[
                  'p-2 rounded-full transition-colors',
                  isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-gray-700'
                ]"
              >
                <HeartIcon :class="['h-6 w-6', isFavorite ? 'fill-current' : '']" />
              </button>
            </div>

            <p class="text-gray-600 dark:text-neutral-400 mb-6">{{ donation.description }}</p>

            <!-- Category -->
            <div class="flex items-center mb-4">
              <TagIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600 dark:text-neutral-400">{{ donation.category?.name }}</span>
            </div>

            <!-- Location -->
            <div class="flex items-center mb-6">
              <MapPinIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ donation.location }}</span>
            </div>

            <!-- Condition -->
            <div class="flex items-center mb-6">
              <SparklesIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">Condição: {{ conditionLabel }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button
                v-if="!isOwner && donation.status === 'available'"
                @click="showContactModal = true"
                class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Tenho Interesse
              </button>

              <button
                v-if="!isOwner"
                @click="startChat"
                class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Enviar Mensagem
              </button>

              <button
                @click="shareItem"
                class="w-full bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center"
              >
                <ShareIcon class="h-5 w-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          <!-- Donor Info Card -->
          <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doador</h3>
            <div class="flex items-center space-x-3">
              <img
                :src="donation.user?.avatar || '/default-avatar.png'"
                :alt="donation.user?.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p class="font-medium text-gray-900">{{ donation.user?.name }}</p>
                <div class="flex items-center">
                  <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600 ml-1">
                    {{ donation.user?.average_rating?.toFixed(1) || 'Sem avaliações' }}
                    <span v-if="donation.user?.total_reviews">
                      ({{ donation.user.total_reviews }} avaliações)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <button
              v-if="!isOwner"
              @click="viewProfile"
              class="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ver Perfil
            </button>
          </div>

          <!-- Report Button -->
          <button
            v-if="!isOwner"
            @click="reportItem"
            class="w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Reportar item
          </button>
        </div>
      </div>

      <!-- Similar Items -->
      <div v-if="similarItems.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Itens Similares</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DonationCard
            v-for="item in similarItems"
            :key="item.id"
            :donation="item"
          />
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <TransitionRoot as="template" :show="showContactModal">
      <Dialog as="div" class="relative z-10" @close="showContactModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Demonstrar Interesse
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-600">
                        Você tem interesse neste item? Abriremos uma conversa com o doador para vocês combinarem a entrega.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    :disabled="confirmingInterest"
                    class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-60"
                    @click="confirmInterest"
                  >
                    <svg v-if="confirmingInterest" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {{ confirmingInterest ? 'Abrindo conversa...' : 'Confirmar Interesse' }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="showContactModal = false"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useErrorHandler } from '@/utils/errorHandler'
import { donationItemsApi, chatApi } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  ArrowLeftIcon,
  HeartIcon,
  TagIcon,
  MapPinIcon,
  SparklesIcon,
  ShareIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import DonationCard from '@/components/donations/DonationCard.vue'
import type { DonationItem } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const error = ref('')
const donation = ref<DonationItem | null>(null)
const similarItems = ref<DonationItem[]>([])
const currentImage = ref('')
const isFavorite = ref(false)
const showContactModal = ref(false)
const confirmingInterest = ref(false)

const statusLabels: Record<string, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  donated: 'Doado'
}

const statusClasses: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  donated: 'bg-gray-100 text-gray-800'
}

// Condition values match exactly what the backend stores
const conditionDisplayMap: Record<string, string> = {
  'Novo': 'Novo',
  'Usado - Excelente estado': 'Excelente estado',
  'Usado - Bom estado': 'Bom estado',
  'Usado - Estado regular': 'Estado regular',
}

const conditionLabel = computed(() => {
  if (!donation.value) return ''
  return conditionDisplayMap[donation.value.condition] ?? donation.value.condition
})

// Build flat image URL array from donation_images or images
const allImages = computed<string[]>(() => {
  if (!donation.value) return []
  if (donation.value.donation_images?.length) {
    return donation.value.donation_images.map(img => img.url ?? img.path)
  }
  if (donation.value.images?.length) {
    return donation.value.images
  }
  return []
})

const isOwner = computed(() => {
  return authStore.user?.id === donation.value?.user_id
})

onMounted(async () => {
  await loadDonation()
})

const loadDonation = async () => {
  try {
    loading.value = true
    error.value = ''
    const id = Number(route.params.id)

    const result = await donationItemsApi.getById(id)
    donation.value = result.data
    similarItems.value = (result.related_items ?? []).filter(i => i.id !== id)
    currentImage.value = allImages.value[0] ?? ''
  } catch (err) {
    handleError(err, 'Erro ao carregar doação')
    error.value = 'Não foi possível carregar os detalhes da doação.'
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  toast.success(isFavorite.value ? 'Item adicionado aos favoritos' : 'Item removido dos favoritos')
}

const startChat = async () => {
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa estar logado para enviar mensagens')
    router.push('/login')
    return
  }
  if (!donation.value) return

  try {
    const chat = await chatApi.create({ donation_item_id: donation.value.id })
    router.push(`/chats/${chat.id}`)
  } catch (err) {
    handleError(err, 'Erro ao abrir conversa')
  }
}

const confirmInterest = async () => {
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa estar logado para demonstrar interesse')
    router.push('/login')
    return
  }
  if (!donation.value) return

  confirmingInterest.value = true
  try {
    const chat = await chatApi.create({ donation_item_id: donation.value.id })
    showContactModal.value = false
    toast.success('Interesse confirmado! O doador foi notificado.')
    router.push(`/chats/${chat.id}`)
  } catch (err) {
    handleError(err, 'Erro ao confirmar interesse')
  } finally {
    confirmingInterest.value = false
  }
}

const shareItem = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: donation.value?.title,
        text: donation.value?.description,
        url: window.location.href,
      })
    } catch {
      // user cancelled share
    }
  } else {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copiado para a área de transferência!')
  }
}

const viewProfile = () => {
  router.push(`/profile/${donation.value?.user_id}`)
}

const reportItem = () => {
  toast.info('Funcionalidade de reportar item será disponibilizada em breve.')
}
</script>
