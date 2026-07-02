<template>
  <div class="pb-24 md:pb-0">
    <!-- Search Hero: compact amber zone -->
    <section class="bg-brand-400 pt-5 pb-7 px-4">
      <div class="max-w-2xl mx-auto">
        <h1 class="font-display text-gray-900 text-center text-xl sm:text-2xl mb-4 leading-snug">
          Doe com o coração,<br class="sm:hidden" /> receba com gratidão
        </h1>
        <div class="relative">
          <MagnifyingGlassIcon
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="O que você procura?"
            @keydown.enter="handleSearch"
            class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-brand-400"
          />
        </div>
      </div>
    </section>

    <!-- Category chips: sticky horizontal scroll -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="overflow-x-auto px-4 py-2.5 scrollbar-none">
        <div class="flex gap-2 w-max">
          <button
            @click="browseDonations(null)"
            :class="[
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeCategoryId === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            Todos
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="browseDonations(cat.id)"
            :class="[
              'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              activeCategoryId === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            <span v-if="cat.icon" class="leading-none" aria-hidden="true">{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
          <div v-if="loadingCategories" class="flex gap-2">
            <div v-for="i in 5" :key="i" class="h-8 w-20 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <!-- Donations feed -->
    <section class="py-5 px-4 bg-gray-50 min-h-[60vh]">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-bold text-gray-900">Doações Recentes</h2>
          <router-link
            to="/donations"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loadingDonations" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            v-for="i in 8"
            :key="i"
            class="rounded-xl bg-white border border-gray-100 animate-pulse"
          >
            <div class="aspect-[4/3] bg-gray-200 rounded-t-xl" />
            <div class="p-3 space-y-2">
              <div class="h-2.5 bg-gray-200 rounded w-1/3" />
              <div class="h-3.5 bg-gray-200 rounded" />
              <div class="h-3.5 bg-gray-200 rounded w-4/5" />
              <div class="h-2.5 bg-gray-200 rounded w-2/3 mt-1" />
            </div>
          </div>
        </div>

        <!-- Grid 2-col mobile → 3 tablet → 4 desktop -->
        <div
          v-else-if="featuredDonations.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <DonationCard
            v-for="donation in featuredDonations"
            :key="donation.id"
            :donation="donation"
          />
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-16">
          <HeartIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-600 mb-4 text-sm">Nenhuma doação disponível ainda.</p>
          <router-link
            v-if="isAuthenticated"
            to="/donations/create"
            class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-gray-800 transition-colors"
          >
            Fazer a Primeira Doação
          </router-link>
        </div>

        <div v-if="!loadingDonations && featuredDonations.length > 0" class="mt-6">
          <router-link
            to="/donations"
            class="flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white transition-colors text-sm"
          >
            Ver Todas as Doações
          </router-link>
        </div>
      </div>
    </section>

    <!-- FAB: Quero Doar (mobile only, acima do tab bar) -->
    <router-link
      :to="isAuthenticated ? '/donations/create' : '/auth/register'"
      class="md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-brand-500 shadow-lg flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      aria-label="Quero Doar"
    >
      <PlusIcon class="w-6 h-6 text-gray-900" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { HeartIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { donationItemsApi, categoriesApi } from '@/services/api'
import type { DonationItem, Category } from '@/types'
import DonationCard from '@/components/donations/DonationCard.vue'

const authStore = useAuthStore()
const router = useRouter()

const featuredDonations = ref<DonationItem[]>([])
const categories = ref<Category[]>([])
const loadingDonations = ref(true)
const loadingCategories = ref(true)
const searchQuery = ref('')
const activeCategoryId = ref<number | null>(null)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleSearch = () => {
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/donations', query: { search: q } })
}

const browseDonations = (categoryId: number | null) => {
  activeCategoryId.value = categoryId
  if (categoryId) {
    router.push({ path: '/donations', query: { category_id: categoryId } })
  } else {
    router.push('/donations')
  }
}

const loadFeaturedDonations = async () => {
  try {
    const response = await donationItemsApi.getAll({ per_page: 8 })
    featuredDonations.value = response.data
  } catch {
    // fail silently on home page
  } finally {
    loadingDonations.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = (await categoriesApi.getAll(false)) as Category[]
    categories.value = response
  } catch {
    // fail silently
  } finally {
    loadingCategories.value = false
  }
}

onMounted(() => {
  loadFeaturedDonations()
  loadCategories()
})
</script>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
