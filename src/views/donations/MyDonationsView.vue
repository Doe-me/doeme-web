<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Minhas Doações</h1>
          <p class="text-gray-600 mt-2">Gerencie seus itens doados</p>
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
        <div class="bg-white rounded-xl shadow-sm p-6">
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

        <div class="bg-white rounded-xl shadow-sm p-6">
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

        <div class="bg-white rounded-xl shadow-sm p-6">
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

        <div class="bg-white rounded-xl shadow-sm p-6">
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
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <!-- Status Filter -->
            <select
              v-model="filters.status"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="donated">Doado</option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="filters.category"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        :title="donations.length === 0 ? 'Nenhuma doação ainda' : 'Nenhum item corresponde aos filtros'"
        :description="donations.length === 0 ? 'Comece criando sua primeira doação!' : 'Tente ajustar os filtros de busca.'"
        :action-text="donations.length === 0 ? 'Criar Primeira Doação' : undefined"
        :action-to="donations.length === 0 ? '/donations/create' : undefined"
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
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              :src="donation.images?.[0] || '/placeholder-image.jpg'"
              :alt="donation.title"
              class="w-full h-48 object-cover"
            />
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
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

            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ donation.description }}
            </p>

            <div class="flex items-center text-sm text-gray-600 mb-4">
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ donation.location }}
            </div>

            <div class="flex items-center justify-between text-sm text-gray-600 mb-6">
              <span>{{ formatDate(donation.created_at) }}</span>
              <span>{{ donation.views || 0 }} visualizações</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <router-link
                :to="`/donations/${donation.id}`"
                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
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
                class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    @click="deleteDonation"
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
import { useAuthStore } from '@/stores/auth'
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
import type { DonationItem, Category } from '@/types'

const authStore = useAuthStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const donations = ref<DonationItem[]>([])
const categories = ref<Category[]>([])
const currentPage = ref(1)
const itemsPerPage = 9
const showDeleteModal = ref(false)
const donationToDelete = ref<DonationItem | null>(null)

const filters = ref({
  status: '',
  category: '',
  search: ''
})

const statusLabels = {
  available: 'Disponível',
  reserved: 'Reservado',
  donated: 'Doado'
}

const statusClasses = {
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  donated: 'bg-gray-100 text-gray-800'
}

const stats = computed(() => {
  return {
    total: donations.value.length,
    available: donations.value.filter(d => d.status === 'available').length,
    reserved: donations.value.filter(d => d.status === 'reserved').length,
    donated: donations.value.filter(d => d.status === 'donated').length
  }
})

const filteredDonations = computed(() => {
  let filtered = donations.value

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

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  const filtered = donations.value.filter(d => {
    if (filters.value.status && d.status !== filters.value.status) return false
    if (filters.value.category && d.category?.id !== parseInt(filters.value.category)) return false
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      return d.title.toLowerCase().includes(search) || d.description.toLowerCase().includes(search)
    }
    return true
  })
  return Math.ceil(filtered.length / itemsPerPage)
})

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - substituir pela chamada real da API
    donations.value = [
      {
        id: 1,
        title: 'Sofá 3 lugares em ótimo estado',
        description: 'Sofá de 3 lugares em excelente estado de conservação. Cor bege, muito confortável.',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
        category: { id: 1, name: 'Móveis' },
        condition: 'like_new',
        status: 'available',
        location: 'São Paulo, SP',
        user_id: authStore.user?.id || 1,
        views: 45,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Livros de programação',
        description: 'Coleção de livros sobre desenvolvimento web e mobile.',
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
        category: { id: 2, name: 'Livros' },
        condition: 'good',
        status: 'reserved',
        location: 'São Paulo, SP',
        user_id: authStore.user?.id || 1,
        views: 23,
        created_at: '2024-01-14T10:00:00Z',
        updated_at: '2024-01-14T10:00:00Z'
      },
      {
        id: 3,
        title: 'Roupas infantis',
        description: 'Lote de roupas infantis de 2 a 4 anos, em bom estado.',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'],
        category: { 
          id: 3, 
          name: 'Roupas',
          slug: 'roupas',
          active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        condition: 'Usado - Bom estado',
        status: 'donated',
        location: 'São Paulo, SP',
        user_id: authStore.user?.id || 1,
        views: 67,
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T10:00:00Z'
      }
    ]

    categories.value = [
      {
        id: 1,
        name: 'Móveis',
        slug: 'moveis',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Livros',
        slug: 'livros',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        name: 'Roupas',
        slug: 'roupas',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Eletrônicos',
        slug: 'eletronicos',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 5,
        name: 'Brinquedos',
        slug: 'brinquedos',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
    
  } catch (error) {
    handleError(error, 'Erro ao carregar suas doações')
    errorMessage.value = 'Não foi possível carregar suas doações.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const confirmDelete = (donation: DonationItem) => {
  donationToDelete.value = donation
  showDeleteModal.value = true
}

const deleteDonation = async () => {
  if (!donationToDelete.value) return
  
  try {
    // Simular exclusão
    await new Promise(resolve => setTimeout(resolve, 500))
    
    donations.value = donations.value.filter(d => d.id !== donationToDelete.value?.id)
    toast.success('Doação excluída com sucesso!')
    
  } catch (error) {
    handleError(error, 'Erro ao excluir doação')
  } finally {
    showDeleteModal.value = false
    donationToDelete.value = null
  }
}
</script>

