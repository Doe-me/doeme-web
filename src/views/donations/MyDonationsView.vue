<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Minhas Doações</h1>
          <p class="text-gray-600 dark:text-neutral-400 mt-2">Gerencie seus itens doados</p>
        </div>
        <router-link
          to="/donations/create"
          class="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Nova Doação
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <GiftIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total de Itens</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Disponíveis</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.available }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Reservados</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.reserved }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <HeartIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Doados</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.donated }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <!-- Status Filter -->
            <select
              v-model="filters.status"
              class="px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="donated">Doado</option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="filters.category"
              class="px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Search -->
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar por título..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
            />
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
        v-else-if="filteredDonations.length === 0"
        :title="donationsStore.userItems.length === 0 ? 'Nenhuma doação ainda' : 'Nenhum item corresponde aos filtros'"
        :description="donationsStore.userItems.length === 0 ? 'Comece criando sua primeira doação!' : 'Tente ajustar os filtros de busca.'"
        :action-text="donationsStore.userItems.length === 0 ? 'Criar Primeira Doação' : undefined"
        :action-to="donationsStore.userItems.length === 0 ? '/donations/create' : undefined"
      >
        <template #icon>
          <GiftIcon class="h-full w-full" />
        </template>
      </EmptyState>

      <!-- Donations Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="donation in filteredDonations"
          :key="donation.id"
          class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              :src="firstImage(donation)"
              :alt="donation.title"
              class="w-full h-48 object-cover"
            />
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {{ donation.title }}
              </h3>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0',
                  statusClasses[donation.status]
                ]"
              >
                {{ statusLabels[donation.status] }}
              </span>
            </div>

            <p class="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
              {{ donation.description }}
            </p>

            <div class="flex items-center text-sm text-gray-600 mb-4">
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ donation.location }}
            </div>

            <div class="text-sm text-gray-600 mb-6">
              {{ formatDate(donation.created_at) }}
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <router-link
                :to="`/donations/${donation.id}`"
                class="flex-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Ver Detalhes
              </router-link>
              <router-link
                :to="`/donations/${donation.id}/edit`"
                class="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-primary-700 transition-colors"
              >
                Editar
              </router-link>
              <button
                @click="confirmDelete(donation)"
                class="px-4 py-2 text-red-600 hover:text-red-700 rounded-lg transition-colors"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span class="px-4 py-2 text-sm font-medium text-gray-700">
            Página {{ currentPage }} de {{ totalPages }}
          </span>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </nav>
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
                      Excluir doação
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-600">
                        Tem certeza que deseja excluir "{{ donationToDelete?.title }}"? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    :disabled="isDeleting"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-60"
                    @click="deleteDonation"
                  >
                    <svg v-if="isDeleting" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
                  </button>
                  <button
                    type="button"
                    :disabled="isDeleting"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-60"
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
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import { useToast } from 'vue-toastification'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  PlusIcon,
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { DonationItem } from '@/types'

const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const isDeleting = ref(false)
const currentPage = ref(1)
const itemsPerPage = 9
const showDeleteModal = ref(false)
const donationToDelete = ref<DonationItem | null>(null)

const filters = ref({
  status: '',
  category: '',
  search: ''
})

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

const categories = computed(() => categoriesStore.categories)

const stats = computed(() => ({
  total: donationsStore.userItems.length,
  available: donationsStore.userItems.filter(d => d.status === 'available').length,
  reserved: donationsStore.userItems.filter(d => d.status === 'reserved').length,
  donated: donationsStore.userItems.filter(d => d.status === 'donated').length,
}))

const allFiltered = computed(() => {
  let filtered = donationsStore.userItems

  if (filters.value.status) {
    filtered = filtered.filter(d => d.status === filters.value.status)
  }

  if (filters.value.category) {
    filtered = filtered.filter(d => d.category?.id === parseInt(filters.value.category))
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(search) ||
      d.description.toLowerCase().includes(search)
    )
  }

  return filtered
})

const filteredDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allFiltered.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(allFiltered.value.length / itemsPerPage))

watch(filters, () => { currentPage.value = 1 }, { deep: true })

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await Promise.all([
      donationsStore.fetchUserItems(),
      categoriesStore.fetchCategories(),
    ])
  } catch (error) {
    handleError(error, 'Erro ao carregar suas doações')
    errorMessage.value = 'Não foi possível carregar suas doações.'
  } finally {
    loading.value = false
  }
}

const firstImage = (donation: DonationItem): string => {
  if (donation.donation_images?.length) {
    return donation.donation_images[0].url ?? donation.donation_images[0].path
  }
  if (donation.images?.length) return donation.images[0]
  return '/placeholder-image.jpg'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const confirmDelete = (donation: DonationItem) => {
  donationToDelete.value = donation
  showDeleteModal.value = true
}

const deleteDonation = async () => {
  if (!donationToDelete.value) return

  isDeleting.value = true
  try {
    await donationsStore.deleteItem(String(donationToDelete.value.id))
    // Also remove from userItems (store.deleteItem only filters items[], not userItems[])
    donationsStore.userItems.splice(
      donationsStore.userItems.findIndex(d => d.id === donationToDelete.value!.id),
      1
    )
    toast.success('Doação excluída com sucesso!')
  } catch (error) {
    handleError(error, 'Erro ao excluir doação')
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
    donationToDelete.value = null
  }
}
</script>
