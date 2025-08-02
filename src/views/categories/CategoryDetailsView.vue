<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-64"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg p-6">
            <div class="h-48 bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="category">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.1\"><circle cx=\"30\" cy=\"30\" r=\"4\"/></g></g></svg>')"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center text-white">
            <!-- Icon -->
            <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full">
              <component
                :is="getCategoryIcon(category.icon)"
                class="w-10 h-10"
              />
            </div>
            
            <!-- Title -->
            <h1 class="text-4xl font-bold mb-4">{{ category.name }}</h1>
            <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {{ category.description }}
            </p>
            
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">{{ category.items_count }}</div>
                <div class="text-blue-100">Total de Itens</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">{{ category.active_donations }}</div>
                <div class="text-blue-100">Doações Ativas</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">{{ category.completed_donations }}</div>
                <div class="text-blue-100">Doações Concluídas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar itens nesta categoria..."
                class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
              <select
                v-model="filters.condition"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as condições</option>
                <option value="new">Novo</option>
                <option value="like_new">Seminovo</option>
                <option value="good">Bom estado</option>
                <option value="fair">Estado regular</option>
              </select>
              
              <select
                v-model="filters.location"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as localidades</option>
                <option value="nearby">Próximo a mim</option>
                <option value="same_city">Mesma cidade</option>
                <option value="same_state">Mesmo estado</option>
              </select>
              
              <select
                v-model="sortBy"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at">Mais recentes</option>
                <option value="title">Nome A-Z</option>
                <option value="distance">Mais próximos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Items Grid -->
        <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DonationCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @click="goToItem(item)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <FolderIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ searchQuery || hasActiveFilters ? 'Nenhum item encontrado' : 'Nenhum item nesta categoria' }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ searchQuery || hasActiveFilters 
              ? 'Tente ajustar seus filtros de busca.' 
              : 'Seja o primeiro a fazer uma doação nesta categoria!' 
            }}
          </p>
          <div class="space-x-3">
            <button
              v-if="searchQuery || hasActiveFilters"
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

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Categoria não encontrada</h3>
      <p class="text-gray-600 mb-6">A categoria que você está procurando não existe ou foi removida.</p>
      <router-link
        to="/categories"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Voltar às categorias
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { useDonationsStore } from '@/stores/donations'
import DonationCard from '@/components/donations/DonationCard.vue'
import {
  MagnifyingGlassIcon,
  FolderIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon,
  ShirtIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  MusicalNoteIcon,
  CameraIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()
const donationsStore = useDonationsStore()

const loading = ref(true)
const loadingMore = ref(false)
const searchQuery = ref('')
const sortBy = ref('created_at')

const filters = ref({
  condition: '',
  location: ''
})

const category = computed(() => categoriesStore.currentCategory)
const items = computed(() => donationsStore.categoryItems)
const hasMoreItems = computed(() => donationsStore.hasMoreCategoryItems)

const hasActiveFilters = computed(() => 
  filters.value.condition || filters.value.location
)

const filteredItems = computed(() => {
  let filtered = items.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  // Filter by condition
  if (filters.value.condition) {
    filtered = filtered.filter(item => item.condition === filters.value.condition)
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'distance':
        // This would require geolocation calculation
        return 0
      default:
        return 0
    }
  })

  return filtered
})

const iconMap = {
  home: HomeIcon,
  shirt: ShirtIcon,
  book: BookOpenIcon,
  computer: ComputerDesktopIcon,
  heart: HeartIcon,
  wrench: WrenchScrewdriverIcon,
  music: MusicalNoteIcon,
  camera: CameraIcon,
  gift: GiftIcon
}

const getCategoryIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || GiftIcon
}

const goToItem = (item: any) => {
  router.push(`/donations/${item.id}`)
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value.condition = ''
  filters.value.location = ''
}

const loadMoreItems = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    await donationsStore.loadMoreCategoryItems(route.params.id as string)
  } catch (error) {
    console.error('Error loading more items:', error)
  } finally {
    loadingMore.value = false
  }
}

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true
    try {
      await Promise.all([
        categoriesStore.fetchCategory(newId as string),
        donationsStore.fetchCategoryItems(newId as string)
      ])
    } catch (error) {
      console.error('Error loading category:', error)
    } finally {
      loading.value = false
    }
  }
}, { immediate: true })

onMounted(async () => {
  const categoryId = route.params.id as string
  if (categoryId) {
    try {
      await Promise.all([
        categoriesStore.fetchCategory(categoryId),
        donationsStore.fetchCategoryItems(categoryId)
      ])
    } catch (error) {
      console.error('Error loading category:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>
