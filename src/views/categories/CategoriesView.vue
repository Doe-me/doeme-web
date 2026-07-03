<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-24 md:pb-0">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">Explore doações por categoria</p>
      </div>

      <!-- Search -->
      <div class="relative mb-6">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar categorias..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        <div v-for="i in 12" :key="i" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-neutral-900">
          <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          <div class="h-3 w-14 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>

      <!-- Error -->
      <ErrorState
        v-else-if="errorMessage"
        :description="errorMessage"
        @retry="loadCategories"
      />

      <!-- Grid -->
      <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        <button
          v-for="category in filteredCategories"
          :key="category.id"
          @click="goToCategory(category)"
          class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-neutral-800 transition-all group"
        >
          <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-neutral-700 transition-colors">
            <component :is="getCategoryIcon(category.name)" class="w-6 h-6 text-gray-600 dark:text-neutral-300 group-hover:text-brand-700 dark:group-hover:text-brand-400" />
          </div>
          <span class="text-xs font-medium text-gray-700 dark:text-neutral-300 text-center leading-tight line-clamp-2 group-hover:text-brand-800 dark:group-hover:text-brand-300 transition-colors">
            {{ category.name }}
          </span>
        </button>
      </div>

      <!-- Empty -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import { useErrorHandler } from '@/utils/errorHandler'
import { getCategoryIcon } from '@/utils/categoryIcons'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { MagnifyingGlassIcon, FolderIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const categoriesStore = useCategoriesStore()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')

const categories = computed(() => categoriesStore.categories)

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter(c => c.name.toLowerCase().includes(q))
})

const goToCategory = (category: { id: number }) => {
  router.push({ path: '/donations', query: { category_id: category.id } })
}

const loadCategories = async () => {
  try {
    loading.value = true
    await categoriesStore.fetchCategories()
  } catch (error) {
    handleError(error, 'Erro ao carregar categorias')
    errorMessage.value = 'Não foi possível carregar as categorias.'
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>
