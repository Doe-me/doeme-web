<template>
  <div
    class="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
    @click="goToDetails"
  >
    <!-- Image -->
    <div class="relative aspect-[4/3] bg-gray-100 overflow-hidden">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="donation.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <PhotoIcon class="w-10 h-10 text-gray-300" />
      </div>

      <!-- Status badge (only for non-available items) -->
      <span
        v-if="donation.status !== 'available'"
        class="absolute top-2 left-2 text-xs font-medium px-1.5 py-0.5 rounded-md"
        :class="statusBadgeClass"
      >
        {{ statusText }}
      </span>

      <!-- Favorite -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        :class="isFavorited ? 'text-red-500' : 'text-gray-400'"
        aria-label="Favoritar"
      >
        <HeartIcon class="w-4 h-4" :class="{ 'fill-current': isFavorited }" />
      </button>
    </div>

    <!-- Body -->
    <div class="p-3">
      <p class="text-xs font-semibold text-brand-600 mb-0.5">Gratuito</p>
      <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
        {{ donation.title }}
      </h3>
      <div class="flex items-center gap-1 text-xs text-gray-500 min-w-0">
        <MapPinIcon class="w-3 h-3 flex-shrink-0" />
        <span class="truncate">{{ donation.location }}</span>
        <span class="flex-shrink-0 text-gray-300" aria-hidden="true">·</span>
        <span class="flex-shrink-0">{{ timeAgo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhotoIcon, MapPinIcon, HeartIcon } from '@heroicons/vue/24/outline'
import type { DonationItem } from '@/types'
import { useToast } from 'vue-toastification'

interface Props {
  donation: DonationItem
}

const props = defineProps<Props>()
const router = useRouter()
const toast = useToast()
const isFavorited = ref(false)

const imageUrl = computed(() => {
  if (props.donation.images?.length) return props.donation.images[0]
  if (props.donation.donation_images?.length) {
    const img = props.donation.donation_images[0]
    return img.url || img.path
  }
  return null
})

const statusBadgeClass = computed(() => {
  switch (props.donation.status) {
    case 'reserved': return 'bg-yellow-100 text-yellow-800'
    case 'donated':  return 'bg-gray-100 text-gray-600'
    default:         return 'bg-gray-100 text-gray-600'
  }
})

const statusText = computed(() => {
  switch (props.donation.status) {
    case 'reserved': return 'Reservado'
    case 'donated':  return 'Doado'
    default:         return props.donation.status
  }
})

const timeAgo = computed(() => {
  if (!props.donation.created_at) return ''
  const diffH = Math.floor((Date.now() - new Date(props.donation.created_at).getTime()) / 3600000)
  if (diffH < 1)   return 'Agora'
  if (diffH < 24)  return `${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30)  return `${diffD}d`
  return `${Math.floor(diffD / 30)}m`
})

const goToDetails = () => {
  router.push(`/donations/${props.donation.id}`)
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  toast.success(isFavorited.value ? 'Adicionado aos favoritos' : 'Removido dos favoritos')
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
