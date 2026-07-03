<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('donations.list.title') }}</h1>
            <p class="mt-2 text-gray-600 dark:text-neutral-400">{{ $t('donations.list.subtitle') }}</p>
          </div>

          <div class="mt-4 sm:mt-0">
            <router-link
              to="/donations/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              {{ $t('donations.list.makeADonation') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Category chips: horizontal scroll shortcuts -->
      <div class="overflow-x-auto mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div class="flex gap-2 w-max pb-1">
          <button
            @click="filters.category_id = ''"
            :class="[
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
              !filters.category_id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700',
            ]"
          >
            Todos
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="filters.category_id = String(cat.id)"
            :class="[
              'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              filters.category_id === String(cat.id)
                ? 'bg-gray-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700',
            ]"
          >
            <span v-if="cat.icon" class="leading-none" aria-hidden="true">{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                :placeholder="$t('donations.list.searchPlaceholder')"
                class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category_id"
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{{ $t('donations.list.allCategories') }}</option>
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
              class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{{ $t('donations.list.allConditions') }}</option>
              <option value="Novo">{{ $t('donations.list.conditionNew') }}</option>
              <option value="Usado - Excelente estado">{{ $t('donations.list.conditionLikeNew') }}</option>
              <option value="Usado - Bom estado">{{ $t('donations.list.conditionGood') }}</option>
              <option value="Usado - Estado regular">{{ $t('donations.list.conditionFair') }}</option>
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
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="nearby" class="ml-2 text-sm text-gray-700 dark:text-neutral-300">
                {{ $t('donations.list.nearMe') }}
              </label>
            </div>

            <!-- Radius input: only shown when nearby is enabled -->
            <div v-if="filters.nearby" class="flex items-center gap-2">
              <label for="radius" class="text-sm text-gray-700 whitespace-nowrap">Raio (km):</label>
              <input
                id="radius"
                v-model.number="filters.radius"
                type="number"
                min="1"
                max="500"
                class="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <span v-if="locationError" class="text-xs text-red-500">{{ locationError }}</span>
              <span v-if="gettingLocation" class="text-xs text-gray-500">Obtendo localização...</span>
            </div>

            <div class="flex items-center">
              <input
                id="available-only"
                v-model="filters.available_only"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="available-only" class="ml-2 text-sm text-gray-700 dark:text-neutral-300">
                {{ $t('donations.list.availableOnly') }}
              </label>
            </div>

            <select
              v-model="filters.sort_by"
              class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="created_at">{{ $t('donations.list.sortRecent') }}</option>
              <option value="title">{{ $t('donations.list.sortNameAZ') }}</option>
              <option value="distance">{{ $t('donations.list.sortNearest') }}</option>
            </select>

            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {{ $t('donations.list.clearFilters') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 flex justify-center">
        <LoadingSpinner size="lg" :text="$t('donations.list.loading')" />
      </div>

      <!-- Error State -->
      <ErrorState
        v-else-if="fetchError"
        :title="$t('donations.list.errorTitle') || 'Erro ao carregar doações'"
        :description="fetchError"
        :show-retry="true"
        @retry="fetchItems"
      />

      <!-- Items Grid -->
      <div v-else-if="filteredItems.length > 0" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <DonationCard
          v-for="item in filteredItems"
          :key="item.id"
          :donation="item"
        />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        :title="hasActiveFilters ? $t('donations.list.noItemsFound') : $t('donations.list.noDonationsAvailable')"
        :description="hasActiveFilters ? $t('donations.list.tryAdjustFilters') : $t('donations.list.beFirstToDonate')"
      >
        <template #action>
          <div class="space-x-3">
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {{ $t('donations.list.clearFilters') }}
            </button>
            <router-link
              to="/donations/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              {{ $t('donations.list.makeADonation') }}
            </router-link>
          </div>
        </template>
      </EmptyState>

      <!-- Load More -->
      <div v-if="hasMoreItems && !loading" class="text-center mt-8">
        <button
          @click="loadMoreItems"
          :disabled="loadingMore"
          class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <svg v-if="loadingMore" class="animate-spin h-4 w-4 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ loadingMore ? $t('donations.list.loading') : $t('donations.list.loadMore') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import { useErrorHandler } from '@/utils/errorHandler'
import DonationCard from '@/components/donations/DonationCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import type { DonationItem, FilterOptions } from '@/types'
import {
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()
const { handleError, getErrorMessage } = useErrorHandler()

const loading = ref(true)
const loadingMore = ref(false)
const fetchError = ref<string | null>(null)
const gettingLocation = ref(false)
const locationError = ref<string | null>(null)

// Geolocation coordinates kept in memory (not encoded in URL)
const userLatitude = ref<number | null>(null)
const userLongitude = ref<number | null>(null)

// Initialize filters from URL query params on first load
const initFiltersFromRoute = () => ({
  search: (route.query.search as string) || '',
  category_id: (route.query.category_id as string) || '',
  condition: (route.query.condition as string) || '',
  nearby: route.query.nearby === 'true',
  available_only: route.query.available_only !== 'false', // default true
  sort_by: (route.query.sort_by as string) || 'created_at',
  radius: route.query.radius ? Number(route.query.radius) : 25,
})

const filters = ref(initFiltersFromRoute())

const items = computed(() => donationsStore.items)
const categories = computed(() => categoriesStore.categories)
const hasMoreItems = computed(() => donationsStore.hasMoreItems)

const hasActiveFilters = computed(() =>
  !!filters.value.search ||
  !!filters.value.category_id ||
  !!filters.value.condition ||
  filters.value.nearby,
)

const filteredItems = computed(() => {
  let filtered = items.value
  if (filters.value.available_only) {
    filtered = filtered.filter((item: DonationItem) => item.status === 'available')
  }
  return filtered
})

// Reflect current filters in URL query params (makes URLs shareable/bookmarkable)
const syncFiltersToUrl = () => {
  const query: Record<string, string> = {}

  if (filters.value.search) query.search = filters.value.search
  if (filters.value.category_id) query.category_id = String(filters.value.category_id)
  if (filters.value.condition) query.condition = filters.value.condition
  if (filters.value.nearby) query.nearby = 'true'
  if (!filters.value.available_only) query.available_only = 'false'
  if (filters.value.sort_by && filters.value.sort_by !== 'created_at') query.sort_by = filters.value.sort_by
  if (filters.value.nearby && filters.value.radius !== 25) query.radius = String(filters.value.radius)

  router.replace({ query })
}

// Request browser geolocation when nearby is toggled on
const requestGeolocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocalização não suportada pelo navegador.'
    filters.value.nearby = false
    return
  }

  gettingLocation.value = true
  locationError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLatitude.value = position.coords.latitude
      userLongitude.value = position.coords.longitude
      gettingLocation.value = false
    },
    (error) => {
      gettingLocation.value = false
      locationError.value = 'Não foi possível obter sua localização. Verifique as permissões do navegador.'
      console.error('Geolocation error:', error)
      filters.value.nearby = false
    },
    { timeout: 10000, maximumAge: 300000 },
  )
}

const clearFilters = () => {
  userLatitude.value = null
  userLongitude.value = null
  locationError.value = null
  filters.value = {
    search: '',
    category_id: '',
    condition: '',
    nearby: false,
    available_only: true,
    sort_by: 'created_at',
    radius: 25,
  }
}

const loadMoreItems = async () => {
  if (loadingMore.value) return

  loadingMore.value = true
  try {
    await donationsStore.loadMoreItems()
  } catch (error) {
    handleError(error, 'Erro ao carregar mais itens')
  } finally {
    loadingMore.value = false
  }
}

const fetchItems = async () => {
  loading.value = true
  fetchError.value = null

  try {
    const apiFilters: FilterOptions = {
      search: filters.value.search || undefined,
      category_id: filters.value.category_id ? Number(filters.value.category_id) : undefined,
      condition: filters.value.condition || undefined,
      sort_by: filters.value.sort_by || undefined,
    }

    if (filters.value.nearby && userLatitude.value !== null && userLongitude.value !== null) {
      apiFilters.latitude = userLatitude.value
      apiFilters.longitude = userLongitude.value
      apiFilters.radius = filters.value.radius
    }

    await donationsStore.fetchItems(apiFilters)
  } catch (error) {
    fetchError.value = getErrorMessage(error, 'Erro ao carregar as doações. Tente novamente.')
    handleError(error, 'Erro ao carregar as doações')
  } finally {
    loading.value = false
  }
}

// Watch filters: update URL and re-fetch items
watch(
  filters,
  (newVal, oldVal) => {
    // Request geolocation when nearby is first toggled on
    if (newVal.nearby && !oldVal.nearby) {
      requestGeolocation()
    }
    syncFiltersToUrl()
    fetchItems()
  },
  { deep: true },
)

// Re-fetch once coordinates are available (nearby already on)
watch([userLatitude, userLongitude], ([lat, lon]) => {
  if (lat !== null && lon !== null && filters.value.nearby) {
    fetchItems()
  }
})

onMounted(async () => {
  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      fetchItems(),
    ])
  } catch (error) {
    handleError(error, 'Erro ao carregar dados iniciais')
  }
})
</script>
