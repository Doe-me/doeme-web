<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="xl" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <ErrorState
        :description="error"
        @retry="loadDonation"
      />
    </div>

    <!-- Main Content -->
    <div v-else-if="donation" class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button 
        @click="$router.go(-1)"
        class="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
        Voltar
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Image Gallery -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200">
              <img 
                :src="currentImage" 
                :alt="donation.title"
                class="w-full h-96 object-cover"
              />
            </div>
            
            <!-- Image Thumbnails -->
            <div v-if="donation.images && donation.images.length > 1" class="p-4">
              <div class="flex space-x-2 overflow-x-auto">
                <button
                  v-for="(image, index) in donation.images"
                  :key="index"
                  @click="currentImage = image"
                  :class="[
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    currentImage === image ? 'border-primary-500' : 'border-gray-200'
                  ]"
                >
                  <img :src="image" :alt="`Imagem ${index + 1}`" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Donation Info -->
        <div class="space-y-6">
          <!-- Main Info Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ donation.title }}</h1>
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusClasses[donation.status]
                  ]"
                >
                  {{ statusLabels[donation.status] }}
                </span>
              </div>
              <button
                @click="toggleFavorite"
                :class="[
                  'p-2 rounded-full transition-colors',
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                ]"
              >
                <HeartIcon :class="['h-6 w-6', isFavorite ? 'fill-current' : '']" />
              </button>
            </div>

            <p class="text-gray-600 mb-6">{{ donation.description }}</p>

            <!-- Category -->
            <div class="flex items-center mb-4">
              <TagIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ donation.category?.name }}</span>
            </div>

            <!-- Location -->
            <div class="flex items-center mb-6">
              <MapPinIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ donation.location }}</span>
            </div>

            <!-- Condition -->
            <div class="flex items-center mb-6">
              <SparklesIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">Condição: {{ conditionLabels[donation.condition] }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button
                v-if="!isOwner && donation.status === 'available'"
                @click="showContactModal = true"
                class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Tenho Interesse
              </button>
              
              <button
                v-if="!isOwner"
                @click="startChat"
                class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Enviar Mensagem
              </button>

              <button
                @click="shareItem"
                class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ShareIcon class="h-5 w-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          <!-- Donor Info Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Doador</h3>
            <div class="flex items-center space-x-3">
              <img 
                :src="donation.user?.avatar || '/default-avatar.png'" 
                :alt="donation.user?.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p class="font-medium text-gray-900">{{ donation.user?.name }}</p>
                <div class="flex items-center">
                  <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600 ml-1">
                    {{ donation.user?.rating || 'Sem avaliações' }}
                    <span v-if="donation.user?.reviews_count">
                      ({{ donation.user.reviews_count }} avaliações)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <button
              v-if="!isOwner"
              @click="viewProfile"
              class="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ver Perfil
            </button>
          </div>

          <!-- Report Button -->
          <button
            v-if="!isOwner"
            @click="reportItem"
            class="w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Reportar item
          </button>
        </div>
      </div>

      <!-- Similar Items -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Itens Similares</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DonationCard
            v-for="item in similarItems"
            :key="item.id"
            :donation="item"
          />
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <TransitionRoot as="template" :show="showContactModal">
      <Dialog as="div" class="relative z-10" @close="showContactModal = false">
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
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Demonstrar Interesse
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-600">
                        Você tem interesse neste item? Enviaremos uma mensagem para o doador informando seu interesse.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
                    @click="confirmInterest"
                  >
                    Confirmar Interesse
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="showContactModal = false"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  ArrowLeftIcon,
  HeartIcon,
  TagIcon,
  MapPinIcon,
  SparklesIcon,
  ShareIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import DonationCard from '@/components/donations/DonationCard.vue'
import type { DonationItem } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { handleError } = useErrorHandler()

const loading = ref(true)
const error = ref('')
const donation = ref<DonationItem | null>(null)
const similarItems = ref<DonationItem[]>([])
const currentImage = ref('')
const isFavorite = ref(false)
const showContactModal = ref(false)

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

const conditionLabels = {
  new: 'Novo',
  like_new: 'Como novo',
  good: 'Bom estado',
  fair: 'Estado regular',
  poor: 'Precisa de reparos'
}

const isOwner = computed(() => {
  return authStore.user?.id === donation.value?.user_id
})

onMounted(async () => {
  await loadDonation()
})

const loadDonation = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    
    // Simular carregamento da doação
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - substituir pela chamada real da API
    donation.value = {
      id: parseInt(id),
      title: 'Sofá 3 lugares em ótimo estado',
      description: 'Sofá de 3 lugares em excelente estado de conservação. Cor bege, muito confortável. Estou me mudando e não tenho espaço no novo apartamento.',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'
      ],
      category: { id: 1, name: 'Móveis' },
      condition: 'like_new',
      status: 'available',
      location: 'São Paulo, SP',
      user_id: 2,
      user: {
        id: 2,
        name: 'Maria Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        rating: 4.8,
        reviews_count: 23
      },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    }

    currentImage.value = donation.value.images?.[0] || ''
    
    // Carregar itens similares
    similarItems.value = [
      {
        id: 2,
        title: 'Poltrona reclinável',
        description: 'Poltrona muito confortável',
        images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400'],
        category: { id: 1, name: 'Móveis' },
        condition: 'good',
        status: 'available',
        location: 'São Paulo, SP',
        user_id: 3,
        created_at: '2024-01-14T10:00:00Z',
        updated_at: '2024-01-14T10:00:00Z'
      },
      {
        id: 3,
        title: 'Mesa de centro',
        description: 'Mesa de centro de madeira',
        images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=400'],
        category: { id: 1, name: 'Móveis' },
        condition: 'good',
        status: 'available',
        location: 'São Paulo, SP',
        user_id: 4,
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T10:00:00Z'
      }
    ]
    
  } catch (err) {
    handleError(err, 'Erro ao carregar doação')
    error.value = 'Não foi possível carregar os detalhes da doação.'
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  toast.success(isFavorite.value ? 'Item adicionado aos favoritos' : 'Item removido dos favoritos')
}

const startChat = () => {
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa estar logado para enviar mensagens')
    router.push('/login')
    return
  }
  
  router.push(`/chat?user=${donation.value?.user_id}`)
}

const confirmInterest = () => {
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa estar logado para demonstrar interesse')
    router.push('/login')
    return
  }
  
  showContactModal.value = false
  toast.success('Interesse demonstrado! O doador foi notificado.')
}

const shareItem = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: donation.value?.title,
        text: donation.value?.description,
        url: window.location.href,
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    // Fallback para copiar URL
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copiado para a área de transferência!')
  }
}

const viewProfile = () => {
  router.push(`/profile/${donation.value?.user_id}`)
}

const reportItem = () => {
  toast.info('Funcionalidade de reportar item será implementada em breve')
}
</script>

