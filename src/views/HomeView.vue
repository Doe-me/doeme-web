<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
            Doe com o
            <span class="text-yellow-300">❤️</span>
          </h1>
          <p class="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Conecte-se com pessoas da sua comunidade e transforme vidas através da generosidade.
            Doe o que não usa mais e ajude quem precisa.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/donations"
              class="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold"
            >
              Ver Doações
            </router-link>
            <router-link
              v-if="isAuthenticated"
              to="/donations/create"
              class="btn bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8 py-3 font-semibold"
            >
              Fazer Doação
            </router-link>
            <router-link
              v-else
              to="/register"
              class="btn bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8 py-3 font-semibold"
            >
              Começar Agora
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label" class="fade-in">
            <div class="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-600 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Doar nunca foi tão simples. Siga estes passos e faça a diferença na vida de alguém.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div v-for="(step, index) in howItWorksSteps" :key="step.title" class="text-center fade-in">
            <div class="relative mb-6">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <component :is="step.icon" class="w-8 h-8 text-primary-600" />
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {{ index + 1 }}
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/how-it-works"
            class="btn-primary text-lg px-8 py-3"
          >
            Saiba Mais
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Donations -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Doações em Destaque
            </h2>
            <p class="text-xl text-gray-600">
              Veja alguns itens disponíveis para doação
            </p>
          </div>
          <router-link
            to="/donations"
            class="btn-outline hidden sm:inline-flex"
          >
            Ver Todas
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
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Categorias Populares
          </h2>
          <p class="text-xl text-gray-600">
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
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">{{ category.icon || '📦' }}</span>
              </div>
              <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
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

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-bold mb-6">
          Pronto para Fazer a Diferença?
        </h2>
        <p class="text-xl mb-8 text-primary-100">
          Junte-se à nossa comunidade e ajude a criar um mundo mais generoso e sustentável.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold"
          >
            Criar Conta Grátis
          </router-link>
          <router-link
            to="/donations/create"
            class="btn bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8 py-3 font-semibold"
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
    description: 'Tire fotos e descreva o item que você quer doar. É rápido e fácil!',
    icon: CameraIcon,
  },
  {
    title: 'Conecte-se',
    description: 'Pessoas interessadas entrarão em contato através do nosso chat.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Faça a Diferença',
    description: 'Combine a entrega e veja o impacto positivo da sua generosidade.',
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
    categories.value = response.slice(0, 6) // Mostrar apenas 6 categorias
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
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>

