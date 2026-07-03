<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Minhas Avaliações</h1>
          <p class="text-gray-600 dark:text-neutral-400 mt-2">Avaliações que você fez e recebeu</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'received'"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'received'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-neutral-200'
            ]"
          >
            Recebidas ({{ receivedReviews.length }})
          </button>
          <button
            @click="activeTab = 'given'"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'given'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-neutral-200'
            ]"
          >
            Feitas ({{ givenReviews.length }})
          </button>
        </nav>
      </div>

      <!-- Stats Cards for Received Reviews -->
      <div v-if="activeTab === 'received' && reviewStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <StarIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avaliação Média</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ reviewStats.average_rating.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Recebidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ reviewStats.total_reviews }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <HandThumbUpIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Positivas</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ reviewStats.rating_distribution[4] + reviewStats.rating_distribution[5] }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <TrendingUpIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Este Mês</p>
              <p class="text-2xl font-bold text-gray-900">{{ thisMonthReviews }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error State -->
      <ErrorState
        v-else-if="errorMessage"
        :description="errorMessage"
        @retry="loadData"
      />

      <!-- Empty State -->
      <EmptyState
        v-else-if="currentReviews.length === 0"
        :title="activeTab === 'received' ? 'Nenhuma avaliação recebida' : 'Nenhuma avaliação feita'"
        :description="activeTab === 'received' ? 'Quando outros usuários avaliarem você, as avaliações aparecerão aqui.' : 'Avalie outros usuários após receber doações para ajudar a comunidade!'"
        :action-text="activeTab === 'given' ? 'Explorar Doações' : undefined"
        :action-to="activeTab === 'given' ? '/donations' : undefined"
      >
        <template #icon>
          <StarIcon class="h-full w-full" />
        </template>
      </EmptyState>

      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div
          v-for="review in currentReviews"
          :key="review.id"
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- User Avatar -->
            <img
              :src="(activeTab === 'received' ? review.reviewer?.avatar : review.reviewed_user?.avatar) || '/default-avatar.png'"
              :alt="activeTab === 'received' ? review.reviewer?.name : review.reviewed_user?.name"
              class="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />

            <div class="flex-1 min-w-0">
              <!-- Header -->
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ activeTab === 'received' ? review.reviewer?.name : review.reviewed_user?.name }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ activeTab === 'received' ? 'avaliou você' : 'foi avaliado por você' }}
                  </p>
                </div>
                <span class="text-sm text-gray-600">
                  {{ formatDate(review.created_at) }}
                </span>
              </div>

              <!-- Rating -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  <StarIcon
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'h-5 w-5',
                      i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    ]"
                  />
                </div>
                <span class="ml-2 text-sm font-medium text-gray-900">
                  {{ review.rating }}/5
                </span>
              </div>

              <!-- Comment -->
              <p v-if="review.comment" class="text-gray-700 mb-4">
                {{ review.comment }}
              </p>

              <!-- Donation Item -->
              <div v-if="review.donation_item" class="bg-gray-50 rounded-lg p-3 mb-4">
                <div class="flex items-center space-x-3">
                  <GiftIcon class="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      Sobre a doação: {{ review.donation_item.title }}
                    </p>
                    <router-link
                      :to="`/donations/${review.donation_item.id}`"
                      class="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Ver item doado
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Actions for Given Reviews -->
              <div v-if="activeTab === 'given'" class="flex items-center space-x-4">
                <button
                  @click="editReview(review)"
                  class="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Editar
                </button>
                <button
                  @click="confirmDeleteReview(review)"
                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Excluir
                </button>
              </div>

              <!-- Response Option for Received Reviews -->
              <div v-if="activeTab === 'received' && !review.response" class="mt-4">
                <button
                  @click="respondToReview(review)"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Responder avaliação
                </button>
              </div>

              <!-- Response Display -->
              <div v-if="review.response" class="mt-4 bg-blue-50 rounded-lg p-3">
                <p class="text-sm font-medium text-blue-900 mb-1">Sua resposta:</p>
                <p class="text-sm text-blue-800">{{ review.response }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreReviews" class="text-center mt-8">
        <button
          @click="loadMoreReviews"
          :disabled="loading"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Carregando...' : 'Carregar Mais' }}
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot as="template" :show="showDeleteModal">
      <Dialog as="div" class="relative z-10" @close="showDeleteModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Excluir avaliação
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-600">
                        Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    @click="deleteReview"
                  >
                    Excluir
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="showDeleteModal = false"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  GiftIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { Review, ReviewStats } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const activeTab = ref<'received' | 'given'>('received')
const showDeleteModal = ref(false)
const reviewToDelete = ref<Review | null>(null)

const receivedReviews = ref<Review[]>([])
const givenReviews = ref<Review[]>([])
const reviewStats = ref<ReviewStats | null>(null)

const currentReviews = computed(() => {
  return activeTab.value === 'received' ? receivedReviews.value : givenReviews.value
})

const hasMoreReviews = computed(() => {
  // Implementar lógica de paginação
  return false
})

const thisMonthReviews = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return receivedReviews.value.filter(review => {
    const reviewDate = new Date(review.created_at)
    return reviewDate.getMonth() === thisMonth && reviewDate.getFullYear() === thisYear
  }).length
})

watch(activeTab, async (newTab) => {
  if (newTab === 'received' && receivedReviews.value.length === 0) {
    await loadReceivedReviews()
  } else if (newTab === 'given' && givenReviews.value.length === 0) {
    await loadGivenReviews()
  }
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    await Promise.all([
      loadReceivedReviews(),
      loadReviewStats()
    ])

  } catch (error) {
    handleError(error, 'Erro ao carregar avaliações')
    errorMessage.value = 'Não foi possível carregar suas avaliações.'
  } finally {
    loading.value = false
  }
}

const loadReceivedReviews = async () => {
  try {
    // Mock data - substituir pela chamada real da API
    receivedReviews.value = [
      {
        id: 1,
        reviewer_id: 2,
        reviewed_user_id: authStore.user?.id || 1,
        donation_item_id: 1,
        rating: 5,
        comment: 'Excelente doador! Item exatamente como descrito e entrega pontual.',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        reviewer: {
          id: 2,
          name: 'Maria Silva',
          email: 'maria@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
        },
        donation_item: {
          id: 1,
          title: 'Sofá 3 lugares em ótimo estado',
          user_id: authStore.user?.id || 1,
          category_id: 1,
          description: 'Sofá em excelente estado',
          condition: 'Usado - Excelente estado',
          location: 'São Paulo, SP',
          status: 'donated',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      },
      {
        id: 2,
        reviewer_id: 3,
        reviewed_user_id: authStore.user?.id || 1,
        donation_item_id: 2,
        rating: 4,
        comment: 'Muito atencioso e prestativo. Recomendo!',
        created_at: '2024-01-12T14:30:00Z',
        updated_at: '2024-01-12T14:30:00Z',
        reviewer: {
          id: 3,
          name: 'João Santos',
          email: 'joao@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        donation_item: {
          id: 2,
          title: 'Livros de programação',
          user_id: authStore.user?.id || 1,
          category_id: 2,
          description: 'Coleção de livros',
          condition: 'Usado - Bom estado',
          location: 'São Paulo, SP',
          status: 'donated',
          created_at: '2024-01-08T10:00:00Z',
          updated_at: '2024-01-12T14:30:00Z'
        }
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar avaliações recebidas:', error)
  }
}

const loadGivenReviews = async () => {
  try {
    // Mock data - substituir pela chamada real da API
    givenReviews.value = [
      {
        id: 3,
        reviewer_id: authStore.user?.id || 1,
        reviewed_user_id: 4,
        donation_item_id: 3,
        rating: 5,
        comment: 'Pessoa muito gentil e organizada. Doação perfeita!',
        created_at: '2024-01-10T16:20:00Z',
        updated_at: '2024-01-10T16:20:00Z',
        reviewed_user: {
          id: 4,
          name: 'Ana Costa',
          email: 'ana@example.com',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
        },
        donation_item: {
          id: 3,
          title: 'Roupas infantis',
          user_id: 4,
          category_id: 3,
          description: 'Lote de roupas infantis',
          condition: 'Usado - Bom estado',
          location: 'São Paulo, SP',
          status: 'donated',
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-10T16:20:00Z'
        }
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar avaliações feitas:', error)
  }
}

const loadReviewStats = async () => {
  try {
    // Mock data - substituir pela chamada real da API
    reviewStats.value = {
      total_reviews: receivedReviews.value.length,
      average_rating: 4.5,
      rating_distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 1
      }
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const loadMoreReviews = async () => {
  // Implementar carregamento de mais avaliações
  toast.info('Funcionalidade de carregar mais será implementada')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const editReview = (review: Review) => {
  router.push(`/reviews/${review.id}/edit`)
}

const confirmDeleteReview = (review: Review) => {
  reviewToDelete.value = review
  showDeleteModal.value = true
}

const deleteReview = async () => {
  if (!reviewToDelete.value) return

  try {
    // Simular exclusão
    givenReviews.value = givenReviews.value.filter(r => r.id !== reviewToDelete.value?.id)
    toast.success('Avaliação excluída com sucesso!')
  } catch (error) {
    handleError(error, 'Erro ao excluir avaliação')
  } finally {
    showDeleteModal.value = false
    reviewToDelete.value = null
  }
}

const respondToReview = () => {
  toast.info('Funcionalidade de responder avaliação será implementada')
}
</script>

