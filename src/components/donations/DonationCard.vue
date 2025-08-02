<template>
  <div class="card hover:shadow-lg transition-all duration-200 group cursor-pointer" @click="goToDetails">
    <!-- Image -->
    <div class="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
      <img
        v-if="donation.images && donation.images.length > 0"
        :src="donation.images[0]"
        :alt="donation.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <PhotoIcon class="w-12 h-12 text-gray-400" />
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-3 left-3">
        <span
          class="badge text-xs font-medium px-2 py-1"
          :class="statusBadgeClass"
        >
          {{ statusText }}
        </span>
      </div>
      
      <!-- Condition Badge -->
      <div class="absolute top-3 right-3">
        <span class="badge-gray text-xs">
          {{ donation.condition }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="card-body">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
        {{ donation.title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ donation.description }}
      </p>
      
      <!-- Location -->
      <div class="flex items-center text-gray-500 text-sm mb-3">
        <MapPinIcon class="w-4 h-4 mr-1" />
        <span class="truncate">{{ donation.location }}</span>
      </div>
      
      <!-- User Info -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            v-if="donation.user?.avatar"
            class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2"
          >
            <img
              :src="donation.user.avatar"
              :alt="donation.user.name"
              class="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium mr-2"
          >
            {{ userInitials }}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ donation.user?.name }}</p>
            <div v-if="donation.user?.average_rating" class="flex items-center">
              <StarIcon class="w-3 h-3 text-yellow-400 fill-current" />
              <span class="text-xs text-gray-500 ml-1">
                {{ donation.user.average_rating.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Time -->
        <span class="text-xs text-gray-500">
          {{ timeAgo }}
        </span>
      </div>
    </div>
    
    <!-- Actions (visible on hover) -->
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
      <div class="flex space-x-2">
        <button
          @click.stop="toggleFavorite"
          class="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
          :class="{ 'text-red-500': isFavorited, 'text-gray-600': !isFavorited }"
        >
          <HeartIcon class="w-5 h-5" :class="{ 'fill-current': isFavorited }" />
        </button>
        <button
          @click.stop="shareItem"
          class="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600"
        >
          <ShareIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhotoIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'
import type { DonationItem } from '@/types'
import { useToast } from 'vue-toastification'

interface Props {
  donation: DonationItem
}

const props = defineProps<Props>()
const router = useRouter()
const toast = useToast()

// State
const isFavorited = ref(false) // TODO: Implementar favoritos

// Computed
const userInitials = computed(() => {
  if (!props.donation.user?.name) return ''
  return props.donation.user.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const statusBadgeClass = computed(() => {
  switch (props.donation.status) {
    case 'available':
      return 'badge-success'
    case 'reserved':
      return 'badge-warning'
    case 'donated':
      return 'badge-gray'
    default:
      return 'badge-gray'
  }
})

const statusText = computed(() => {
  switch (props.donation.status) {
    case 'available':
      return 'Disponível'
    case 'reserved':
      return 'Reservado'
    case 'donated':
      return 'Doado'
    default:
      return 'Desconhecido'
  }
})

const timeAgo = computed(() => {
  const now = new Date()
  const created = new Date(props.donation.created_at)
  const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Agora há pouco'
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }
})

// Methods
const goToDetails = () => {
  router.push(`/donations/${props.donation.id}`)
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  // TODO: Implementar API de favoritos
  toast.success(isFavorited.value ? 'Adicionado aos favoritos' : 'Removido dos favoritos')
}

const shareItem = async () => {
  const url = `${window.location.origin}/donations/${props.donation.id}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.donation.title,
        text: props.donation.description,
        url: url,
      })
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  } else {
    // Fallback: copiar para clipboard
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      toast.error('Erro ao copiar link')
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

