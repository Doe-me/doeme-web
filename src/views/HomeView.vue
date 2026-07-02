<template>
  <div class="home">
    <!-- Hero Section: amber brand surface, no gradient -->
    <section class="bg-brand-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="font-display text-gray-900 mb-6 leading-none tracking-tight"
              style="font-size: clamp(2.5rem, 6vw, 4.5rem)">
            Doe com o coração
          </h1>
          <p class="text-lg sm:text-xl text-gray-800 mb-3 max-w-2xl mx-auto leading-relaxed">
            Conecte-se com pessoas da sua comunidade. Doe o que não usa mais
            e ajude quem precisa — simples assim.
          </p>
          <p class="text-sm text-gray-700 mb-10">
            Mais de {{ stats[0].value }} itens já encontraram novo lar na vizinhança.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link
              to="/donations"
              class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-base font-semibold px-7 py-3 hover:bg-gray-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              Ver Doações
            </router-link>
            <router-link
              v-if="isAuthenticated"
              to="/donations/create"
              class="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 text-base font-semibold px-7 py-3 hover:bg-gray-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-400"
            >
              Fazer Doação
            </router-link>
            <router-link
              v-else
              to="/register"
              class="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 text-base font-semibold px-7 py-3 hover:bg-gray-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-400"
            >
              Começar Agora
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section: flow without number badges -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p class="text-lg text-gray-600 max-w-xl mx-auto">
            Três passos e um item que estava parado começa uma nova história.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-10 lg:gap-16 relative">
          <!-- Connector line (desktop only) -->
          <div class="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gray-200" aria-hidden="true"></div>

          <div v-for="step in howItWorksSteps" :key="step.title" class="flex flex-col items-center text-center fade-in">
            <div class="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-5 shrink-0 relative z-10">
              <component :is="step.icon" class="w-7 h-7 text-brand-700" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed max-w-xs">{{ step.description }}</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/how-it-works"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm gap-1 transition-colors"
          >
            Saiba mais
            <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Donations -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Doações em Destaque
            </h2>
            <p class="text-gray-600">
              Itens disponíveis agora perto de você
            </p>
          </div>
          <router-link
            to="/donations"
            class="hidden sm:inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm gap-1 transition-colors"
          >
            Ver todas
            <span aria-hidden="true">→</span>
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loadingDonations" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card animate-pulse">
            <div class="h-48 bg-gray-200 rounded-t-lg"></div>
            <div class="card-body">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Donations Grid -->
        <div v-else-if="featuredDonations.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DonationCard
            v-for="donation in featuredDonations"
            :key="donation.id"
            :donation="donation"
            class="fade-in"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <HeartIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma doação encontrada</h3>
          <p class="text-gray-600 mb-6">Seja o primeiro a fazer uma doação!</p>
          <router-link
            v-if="isAuthenticated"
            to="/donations/create"
            class="btn-primary"
          >
            Criar Doação
          </router-link>
          <router-link
            v-else
            to="/register"
            class="btn-primary"
          >
            Cadastrar-se
          </router-link>
        </div>

        <div class="text-center mt-8 sm:hidden">
          <router-link
            to="/donations"
            class="btn-outline"
          >
            Ver Todas as Doações
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Categorias Populares
          </h2>
          <p class="text-gray-600">
            Encontre doações por categoria
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loadingCategories" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="i in 6" :key="i" class="card animate-pulse">
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div v-else-if="categories.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/categories/${category.id}`"
            class="card hover:shadow-md transition-shadow duration-200 fade-in"
          >
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">{{ category.icon || '📦' }}</span>
              </div>
              <h3 class="font-medium text-gray-900 text-sm">{{ category.name }}</h3>
            </div>
          </router-link>
        </div>

        <div class="text-center mt-8">
          <router-link
            to="/categories"
            class="btn-outline"
          >
            Ver Todas as Categorias
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section: dark surface instead of corporate blue -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl lg:text-3xl font-bold mb-4">
          Pronto para Fazer a Diferença?
        </h2>
        <p class="text-gray-700 mb-8 text-lg leading-relaxed">
          Junte-se à nossa comunidade e ajude a criar um bairro mais generoso.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 text-base font-semibold px-7 py-3 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Criar Conta Grátis
          </router-link>
          <router-link
            to="/donations/create"
            class="inline-flex items-center justify-center rounded-lg bg-brand-400 text-gray-900 text-base font-semibold px-7 py-3 hover:bg-brand-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            {{ isAuthenticated ? 'Fazer Doação' : 'Começar Agora' }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  HeartIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { donationItemsApi, categoriesApi } from '@/services/api'
import type { DonationItem, Category } from '@/types'
import DonationCard from '@/components/donations/DonationCard.vue'

const authStore = useAuthStore()

// State
const featuredDonations = ref<DonationItem[]>([])
const categories = ref<Category[]>([])
const loadingDonations = ref(true)
const loadingCategories = ref(true)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Static data
const stats = [
  { value: '1.2K+', label: 'Doações Realizadas' },
  { value: '850+', label: 'Pessoas Ajudadas' },
  { value: '95%', label: 'Satisfação' },
  { value: '24h', label: 'Resposta Média' },
]

const howItWorksSteps = [
  {
    title: 'Cadastre seu Item',
    description: 'Tire fotos e descreva o item que você quer doar. É rápido e fácil.',
    icon: CameraIcon,
  },
  {
    title: 'Conecte-se',
    description: 'Pessoas interessadas entram em contato pelo chat integrado.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Faça a Diferença',
    description: 'Combine a entrega e veja o impacto da sua generosidade.',
    icon: StarIcon,
  },
]

// Methods
const loadFeaturedDonations = async () => {
  try {
    loadingDonations.value = true
    const response = await donationItemsApi.getAll({ per_page: 6 })
    featuredDonations.value = response.data
  } catch (error) {
    console.error('Erro ao carregar doações:', error)
  } finally {
    loadingDonations.value = false
  }
}

const loadCategories = async () => {
  try {
    loadingCategories.value = true
    const response = await categoriesApi.getAll(false) as Category[]
    categories.value = response.slice(0, 6)
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  } finally {
    loadingCategories.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadFeaturedDonations()
  loadCategories()
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }
}
</style>
