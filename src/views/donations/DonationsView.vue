<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Doações Disponíveis</h1>
            <p class="mt-2 text-gray-600">Encontre itens incríveis doados pela comunidade</p>
          </div>
          
          <div class="mt-4 sm:mt-0">
            <router-link
              to="/donations/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Fazer uma doação
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                placeholder="Buscar itens..."
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as categorias</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Condition Filter -->
          <div>
            <select
              v-model="filters.condition"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as condições</option>
              <option value="new">Novo</option>
              <option value="like_new">Seminovo</option>
              <option value="good">Bom estado</option>
              <option value="fair">Estado regular</option>
            </select>
          </div>
        </div>
        
        <!-- Advanced Filters -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center">
              <input
                id="nearby"
                v-model="filters.nearby"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="nearby" class="ml-2 text-sm text-gray-700">
                Próximo a mim
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="available-only"
                v-model="filters.available_only"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="available-only" class="ml-2 text-sm text-gray-700">
                Apenas disponíveis
              </label>
            </div>
            
            <select
              v-model="filters.sort_by"
              class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="created_at">Mais recentes</option>
              <option value="title">Nome A-Z</option>
              <option value="distance">Mais próximos</option>
            </select>
            
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <GiftIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total de Itens</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Disponíveis</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.available }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Reservados</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.reserved }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <HeartIcon class="h-8 w-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Doados</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.donated }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div class="flex items-center justify-between">
                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div v-else-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DonationCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @click="goToItem(item)"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <GiftIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ hasActiveFilters ? 'Nenhum item encontrado' : 'Nenhuma doação disponível' }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ hasActiveFilters 
            ? 'Tente ajustar seus filtros de busca.' 
            : 'Seja o primeiro a fazer uma doação!' 
          }}
        </p>
        <div class="space-x-3">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Limpar filtros
          </button>
          <router-link
            to="/donations/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Fazer uma doação
          </router-link>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreItems" class="text-center mt-8">
        <button
          @click="loadMoreItems"
          :disabled="loadingMore"
          class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <span v-if="loadingMore" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></span>
          {{ loadingMore ? 'Carregando...' : 'Carregar mais itens' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import DonationCard from '@/components/donations/DonationCard.vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()

const loading = ref(true)
const loadingMore = ref(false)

const filters = ref({
  search: '',
  category_id: '',
  condition: '',
  nearby: false,
  available_only: true,
  sort_by: 'created_at'
})

const stats = ref({
  total: 0,
  available: 0,
  reserved: 0,
  donated: 0
})

const items = computed(() => donationsStore.items)
const categories = computed(() => categoriesStore.categories)
const hasMoreItems = computed(() => donationsStore.hasMoreItems)

const hasActiveFilters = computed(() => 
  filters.value.search || 
  filters.value.category_id || 
  filters.value.condition ||
  filters.value.nearby
)

const filteredItems = computed(() => {
  let filtered = items.value

  // Apply client-side filters if needed
  if (filters.value.available_only) {
    filtered = filtered.filter(item => item.is_available)
  }

  return filtered
})

const goToItem = (item: any) => {
  router.push(`/donations/${item.id}`)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category_id: '',
    condition: '',
    nearby: false,
    available_only: true,
    sort_by: 'created_at'
  }
}

const loadMoreItems = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    await donationsStore.loadMoreItems()
  } catch (error) {
    console.error('Error loading more items:', error)
  } finally {
    loadingMore.value = false
  }
}

const fetchItems = async () => {
  loading.value = true
  try {
    await donationsStore.fetchItems(filters.value)
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await donationsStore.fetchStats()
    stats.value = response
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

// Watch filters and refetch items
watch(filters, () => {
  fetchItems()
}, { deep: true })

onMounted(async () => {
  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      fetchItems(),
      fetchStats()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>
