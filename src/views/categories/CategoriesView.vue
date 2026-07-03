<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categorias</h1>
            <p class="mt-2 text-gray-600 dark:text-neutral-400">Explore doações por categoria</p>
          </div>
          
          <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar categorias..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
              />
            </div>
            
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            >
              <option value="name">Nome</option>
              <option value="items_count">Mais itens</option>
              <option value="created_at">Mais recentes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error State -->
      <ErrorState
        v-else-if="errorMessage"
        :description="errorMessage"
        @retry="onMounted"
      />

      <!-- Categories Grid -->
      <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          @click="goToCategory(category)"
          class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
        >
          <div class="p-6">
            <!-- Icon -->
            <div class="flex items-center justify-center w-12 h-12 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200"
                 :style="{ backgroundColor: category.color + '20' }">
              <component
                :is="getCategoryIcon(category.icon)"
                class="w-6 h-6"
                :style="{ color: category.color }"
              />
            </div>
            
            <!-- Content -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-neutral-400 mb-4 line-clamp-2">
                {{ category.description }}
              </p>
              
              <!-- Stats -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-gray-600 dark:text-neutral-400">
                  <GiftIcon class="w-4 h-4 mr-1" />
                  <span>{{ category.items_count }} itens</span>
                </div>
                <div class="flex items-center text-green-600">
                  <TrendingUpIcon class="w-4 h-4 mr-1" />
                  <span>{{ category.active_donations }} ativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        :title="searchQuery ? 'Nenhuma categoria encontrada' : 'Sem categorias disponíveis'"
        :description="searchQuery ? 'Tente ajustar sua busca.' : 'Não há categorias disponíveis no momento.'"
        :action-text="searchQuery ? 'Limpar busca' : undefined"
        :action-click="searchQuery ? () => { searchQuery = '' } : undefined"
      >
        <template #icon>
          <FolderIcon class="h-full w-full" />
        </template>
      </EmptyState>

      <!-- Popular Categories Section -->
      <div v-if="!searchQuery && popularCategories.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Categorias Populares</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="category in popularCategories"
            :key="category.id"
            @click="goToCategory(category)"
            class="bg-primary-600 rounded-lg p-6 text-white cursor-pointer hover:bg-primary-700 hover:shadow-lg transition-all duration-200 group"
          >
            <div class="flex items-center justify-between mb-4">
              <component
                :is="getCategoryIcon(category.icon)"
                class="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
              />
              <span class="text-2xl font-bold">{{ category.items_count }}</span>
            </div>

            <h3 class="text-xl font-semibold mb-2">{{ category.name }}</h3>
            <p class="text-primary-100 text-sm">{{ category.items_count }} itens disponíveis</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  MagnifyingGlassIcon,
  GiftIcon,
  TrendingUpIcon,
  FolderIcon,
  HomeIcon,
  ShirtIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  MusicalNoteIcon,
  CameraIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const sortBy = ref('name')

const categories = computed(() => categoriesStore.categories)
const popularCategories = computed(() => 
  categories.value
    .filter(cat => cat.items_count > 5)
    .sort((a, b) => b.items_count - a.items_count)
    .slice(0, 3)
)

const filteredCategories = computed(() => {
  let filtered = categories.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    )
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'items_count':
        return b.items_count - a.items_count
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

const goToCategory = (category: { id: number }) => {
  router.push(`/categories/${category.id}`)
}

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories()
  } catch (error) {
    handleError(error, 'Erro ao carregar categorias')
    errorMessage.value = 'Não foi possível carregar as categorias.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
