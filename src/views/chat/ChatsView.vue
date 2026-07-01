<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mensagens</h1>
          <p class="text-gray-600 mt-2">Suas conversas sobre doações</p>
        </div>
        
        <!-- Search -->
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar conversas..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error State -->
      <ErrorState
        v-else-if="errorMessage"
        :description="errorMessage"
        @retry="loadChats"
      />

      <!-- Empty State -->
      <EmptyState
        v-else-if="filteredChats.length === 0"
        :title="chats.length === 0 ? 'Nenhuma conversa ainda' : 'Nenhuma conversa encontrada'"
        :description="chats.length === 0 ? 'Comece uma conversa demonstrando interesse em uma doação!' : 'Tente ajustar sua busca.'"
        :action-text="chats.length === 0 ? 'Explorar Doações' : undefined"
        :action-to="chats.length === 0 ? '/donations' : undefined"
      >
        <template #icon>
          <ChatBubbleLeftRightIcon class="h-full w-full" />
        </template>
      </EmptyState>

      <!-- Chats List -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="openChat(chat)"
            class="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex items-start space-x-4">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <img
                  :src="chat.otherUser.avatar || '/default-avatar.png'"
                  :alt="chat.otherUser.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div
                  v-if="chat.otherUser.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"
                ></div>
              </div>

              <!-- Chat Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-semibold text-gray-900 truncate">
                    {{ chat.otherUser.name }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {{ formatTime(chat.lastMessage?.created_at) }}
                  </span>
                </div>

                <!-- Donation Item -->
                <div class="flex items-center text-sm text-gray-600 mb-2">
                  <GiftIcon class="h-4 w-4 mr-1 flex-shrink-0" />
                  <span class="truncate">{{ chat.donationItem.title }}</span>
                </div>

                <!-- Last Message -->
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 truncate">
                    <span v-if="chat.lastMessage?.user_id === authStore.user?.id" class="text-gray-500">
                      Você: 
                    </span>
                    {{ chat.lastMessage?.message || 'Nenhuma mensagem ainda' }}
                  </p>
                  
                  <!-- Unread Badge -->
                  <span
                    v-if="chat.unreadCount > 0"
                    class="ml-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center"
                  >
                    {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
                  </span>
                </div>
              </div>

              <!-- Status Indicator -->
              <div class="flex-shrink-0">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusClasses[chat.donationItem.status]
                  ]"
                >
                  {{ statusLabels[chat.donationItem.status] }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span class="px-4 py-2 text-sm font-medium text-gray-700">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'
import type { Chat } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const loading = ref(true)
const errorMessage = ref('')
const chats = ref<Chat[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

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

const filteredChats = computed(() => {
  let filtered = chats.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chat => 
      chat.otherUser.name.toLowerCase().includes(query) ||
      chat.donationItem.title.toLowerCase().includes(query) ||
      chat.lastMessage?.message.toLowerCase().includes(query)
    )
  }

  // Sort by last message time (most recent first)
  filtered.sort((a, b) => {
    const timeA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0
    const timeB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0
    return timeB - timeA
  })

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = chats.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chat => 
      chat.otherUser.name.toLowerCase().includes(query) ||
      chat.donationItem.title.toLowerCase().includes(query) ||
      chat.lastMessage?.message.toLowerCase().includes(query)
    )
  }
  
  return Math.ceil(filtered.length / itemsPerPage)
})

// Reset page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(async () => {
  await loadChats()
})

const loadChats = async () => {
  try {
    loading.value = true
    
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - substituir pela chamada real da API
    chats.value = [
      {
        id: 1,
        donationItem: {
          id: 1,
          title: 'Sofá 3 lugares em ótimo estado',
          status: 'available'
        },
        otherUser: {
          id: 2,
          name: 'Maria Silva',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          isOnline: true
        },
        lastMessage: {
          id: 1,
          message: 'Olá! Ainda está disponível?',
          user_id: 2,
          created_at: '2024-01-15T14:30:00Z'
        },
        unreadCount: 2,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z'
      },
      {
        id: 2,
        donationItem: {
          id: 2,
          title: 'Livros de programação',
          status: 'reserved'
        },
        otherUser: {
          id: 3,
          name: 'João Santos',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          isOnline: false
        },
        lastMessage: {
          id: 2,
          message: 'Perfeito! Quando posso buscar?',
          user_id: 3,
          created_at: '2024-01-14T16:45:00Z'
        },
        unreadCount: 0,
        created_at: '2024-01-14T12:00:00Z',
        updated_at: '2024-01-14T16:45:00Z'
      },
      {
        id: 3,
        donationItem: {
          id: 3,
          title: 'Roupas infantis',
          status: 'donated'
        },
        otherUser: {
          id: 4,
          name: 'Ana Costa',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          isOnline: true
        },
        lastMessage: {
          id: 3,
          message: 'Muito obrigada! As roupas estão perfeitas.',
          user_id: 4,
          created_at: '2024-01-13T18:20:00Z'
        },
        unreadCount: 0,
        created_at: '2024-01-13T09:00:00Z',
        updated_at: '2024-01-13T18:20:00Z'
      }
    ]
    
  } catch (error) {
    handleError(error, 'Erro ao carregar conversas')
    errorMessage.value = 'Não foi possível carregar suas conversas.'
  } finally {
    loading.value = false
  }
}

const formatTime = (dateString?: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60)
    return diffInMinutes <= 1 ? 'Agora' : `${diffInMinutes}m`
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`
  } else if (diffInHours < 48) {
    return 'Ontem'
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
}

const openChat = (chat: Chat) => {
  router.push(`/chat/${chat.id}`)
}
</script>

