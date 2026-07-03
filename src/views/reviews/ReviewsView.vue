<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Avaliações</h1>
          <p class="text-gray-600 dark:text-neutral-400 mt-2">Veja o que outros usuários estão dizendo</p>
        </div>
        
        <!-- Filters -->
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            v-model="filters.rating"
            class="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          >
            <option value="">Todas as avaliações</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="2">2 estrelas</option>
            <option value="1">1 estrela</option>
          </select>
          
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar avaliações..."
              class="pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
            />
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="reviewStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <StarIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-neutral-400">Avaliação Média</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
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
              <p class="text-sm font-medium text-gray-600 dark:text-neutral-400">Total de Avaliações</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ reviewStats.total_reviews }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <HandThumbUpIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-neutral-400">Avaliações Positivas</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ reviewStats.rating_distribution[4] + reviewStats.rating_distribution[5] }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <UsersIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-neutral-400">Usuários Avaliados</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ new Set(reviews.map(r => r.reviewed_user_id)).size }}
              </p>
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
        v-else-if="filteredReviews.length === 0"
        :title="reviews.length === 0 ? 'Nenhuma avaliação ainda' : 'Nenhuma avaliação encontrada'"
        :description="reviews.length === 0 ? 'Seja o primeiro a avaliar um usuário!' : 'Tente ajustar os filtros de busca.'"
      >
        <template #icon>
          <StarIcon class="h-full w-full" />
        </template>
      </EmptyState>

      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- Reviewer Avatar -->
            <img
              :src="review.reviewer?.avatar || '/default-avatar.png'"
              :alt="review.reviewer?.name"
              class="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />

            <div class="flex-1 min-w-0">
              <!-- Header -->
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ review.reviewer?.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">
                    avaliou 
                    <router-link
                      :to="`/profile/${review.reviewed_user_id}`"
                      class="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {{ review.reviewed_user?.name }}
                    </router-link>
                  </p>
                </div>
                <span class="text-sm text-gray-600 dark:text-neutral-400">
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
                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  {{ review.rating }}/5
                </span>
              </div>

              <!-- Comment -->
              <p v-if="review.comment" class="text-gray-700 dark:text-neutral-300 mb-4">
                {{ review.comment }}
              </p>

              <!-- Donation Item -->
              <div v-if="review.donation_item" class="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                <div class="flex items-center space-x-3">
                  <GiftIcon class="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
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

              <!-- Actions -->
              <div v-if="authStore.user?.id === review.reviewer_id" class="flex items-center space-x-4 mt-4">
                <button
                  @click="editReview(review)"
                  class="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 font-medium"
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Excluir avaliação
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-600 dark:text-neutral-400">
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
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-neutral-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 sm:mt-0 sm:w-auto"
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
import { useReviewsStore } from '@/stores/reviews'
import { useToast } from 'vue-toastification'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  MagnifyingGlassIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  UsersIcon,
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
import type { Review } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const reviewsStore = useReviewsStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const showDeleteModal = ref(false)
const reviewToDelete = ref<Review | null>(null)

const filters = ref({
  rating: '',
  search: ''
})

const reviews = computed(() => reviewsStore.reviews)
const reviewStats = computed(() => reviewsStore.reviewStats)
const pagination = computed(() => reviewsStore.pagination)

const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (filters.value.rating) {
    filtered = filtered.filter(review => review.rating === parseInt(filters.value.rating))
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(review => 
      review.reviewer?.name.toLowerCase().includes(search) ||
      review.reviewed_user?.name.toLowerCase().includes(search) ||
      review.comment?.toLowerCase().includes(search) ||
      review.donation_item?.title.toLowerCase().includes(search)
    )
  }

  return filtered
})

const hasMoreReviews = computed(() => {
  return pagination.value.current_page < pagination.value.last_page
})

// Reset filters
watch(filters, () => {
  // Recarregar reviews quando filtros mudarem
}, { deep: true })

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    await Promise.all([
      reviewsStore.fetchReviews({ page: 1 }),
      loadReviewStats()
    ])

  } catch (error) {
    handleError(error, 'Erro ao carregar avaliações')
    errorMessage.value = 'Não foi possível carregar as avaliações.'
  } finally {
    loading.value = false
  }
}

const loadReviewStats = async () => {
  try {
    // Mock data para estatísticas gerais
    reviewsStore.reviewStats = {
      total_reviews: 156,
      average_rating: 4.3,
      rating_distribution: {
        1: 5,
        2: 8,
        3: 23,
        4: 45,
        5: 75
      }
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const loadMoreReviews = async () => {
  try {
    const nextPage = pagination.value.current_page + 1
    await reviewsStore.fetchReviews({ page: nextPage })
  } catch (error) {
    handleError(error, 'Erro ao carregar mais avaliações')
  }
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
    await reviewsStore.deleteReview(reviewToDelete.value.id)
    toast.success('Avaliação excluída com sucesso!')
  } catch (error) {
    handleError(error, 'Erro ao excluir avaliação')
  } finally {
    showDeleteModal.value = false
    reviewToDelete.value = null
  }
}
</script>

