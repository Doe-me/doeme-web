<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold text-red-800 mb-2">Erro ao carregar conversa</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="$router.go(-1)"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>

    <!-- Chat Interface -->
    <div v-else-if="chat" class="flex flex-col h-screen">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Back Button -->
          <button 
            @click="$router.go(-1)"
            class="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"
          >
            <ArrowLeftIcon class="h-6 w-6" />
          </button>

          <!-- User Info -->
          <div class="flex items-center space-x-3">
            <div class="relative">
              <img
                :src="chat.otherUser.avatar || '/default-avatar.png'"
                :alt="chat.otherUser.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-if="chat.otherUser.isOnline"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"
              ></div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ chat.otherUser.name }}</h2>
              <p class="text-sm text-gray-600">
                {{ chat.otherUser.isOnline ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click="viewDonationItem"
            class="text-gray-600 hover:text-gray-800 transition-colors"
            title="Ver item"
          >
            <GiftIcon class="h-6 w-6" />
          </button>
          <button
            @click="showUserProfile"
            class="text-gray-600 hover:text-gray-800 transition-colors"
            title="Ver perfil"
          >
            <UserIcon class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Donation Item Info -->
      <div class="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div class="flex items-center space-x-3">
          <img
            :src="chat.donationItem.image || '/placeholder-image.jpg'"
            :alt="chat.donationItem.title"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ chat.donationItem.title }}</h3>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  statusClasses[chat.donationItem.status]
                ]"
              >
                {{ statusLabels[chat.donationItem.status] }}
              </span>
              <span class="text-sm text-gray-600">{{ chat.donationItem.location }}</span>
            </div>
          </div>
          <button
            @click="viewDonationItem"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver detalhes
          </button>
        </div>
      </div>

      <!-- Messages Container -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        @scroll="handleScroll"
      >
        <!-- Load More Button -->
        <div v-if="hasMoreMessages" class="text-center">
          <button
            @click="loadMoreMessages"
            :disabled="loadingMore"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
          >
            {{ loadingMore ? 'Carregando...' : 'Carregar mensagens anteriores' }}
          </button>
        </div>

        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.user_id === authStore.user?.id ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
              message.user_id === authStore.user?.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
            ]"
          >
            <p class="text-sm">{{ message.message }}</p>
            <p
              :class="[
                'text-xs mt-1',
                message.user_id === authStore.user?.id
                  ? 'text-primary-100'
                  : 'text-gray-500'
              ]"
            >
              {{ formatMessageTime(message.created_at) }}
              <span
                v-if="message.user_id === authStore.user?.id && message.read_at"
                class="ml-1"
              >
                ✓✓
              </span>
            </p>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-xs">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-white border-t border-gray-200 px-4 py-4">
        <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
          <div class="flex-1">
            <textarea
              v-model="newMessage"
              @keydown="handleKeyDown"
              @input="handleTyping"
              placeholder="Digite sua mensagem..."
              rows="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              style="min-height: 40px; max-height: 120px;"
            ></textarea>
          </div>
          
          <button
            type="submit"
            :disabled="!newMessage.trim() || sending"
            class="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {
  ArrowLeftIcon,
  GiftIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import type { Chat, ChatMessage } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const error = ref('')
const chat = ref<Chat | null>(null)
const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const sending = ref(false)
const isTyping = ref(false)
const hasMoreMessages = ref(false)
const loadingMore = ref(false)
const messagesContainer = ref<HTMLElement>()

let typingTimeout: NodeJS.Timeout | null = null

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

onMounted(async () => {
  await loadChat()
  scrollToBottom()
})

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})

const loadChat = async () => {
  try {
    loading.value = true
    const chatId = route.params.id as string
    
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - substituir pela chamada real da API
    chat.value = {
      id: parseInt(chatId),
      donationItem: {
        id: 1,
        title: 'Sofá 3 lugares em ótimo estado',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        location: 'São Paulo, SP'
      },
      otherUser: {
        id: 2,
        name: 'Maria Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        isOnline: true
      },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z'
    }

    messages.value = [
      {
        id: 1,
        chat_id: parseInt(chatId),
        user_id: 2,
        message: 'Olá! Vi seu anúncio do sofá. Ainda está disponível?',
        created_at: '2024-01-15T10:05:00Z',
        read_at: '2024-01-15T10:06:00Z'
      },
      {
        id: 2,
        chat_id: parseInt(chatId),
        user_id: authStore.user?.id || 1,
        message: 'Oi! Sim, ainda está disponível. Você tem interesse?',
        created_at: '2024-01-15T10:10:00Z',
        read_at: '2024-01-15T10:11:00Z'
      },
      {
        id: 3,
        chat_id: parseInt(chatId),
        user_id: 2,
        message: 'Tenho sim! Posso ver ele pessoalmente? Moro próximo.',
        created_at: '2024-01-15T10:15:00Z',
        read_at: '2024-01-15T10:16:00Z'
      },
      {
        id: 4,
        chat_id: parseInt(chatId),
        user_id: authStore.user?.id || 1,
        message: 'Claro! Que tal amanhã à tarde? Por volta das 14h?',
        created_at: '2024-01-15T10:20:00Z',
        read_at: null
      }
    ]
    
  } catch (err) {
    error.value = 'Não foi possível carregar a conversa'
    console.error('Erro ao carregar chat:', err)
  } finally {
    loading.value = false
  }
}

const loadMoreMessages = async () => {
  try {
    loadingMore.value = true
    
    // Simular carregamento de mensagens antigas
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock: adicionar mensagens mais antigas
    const olderMessages = [
      {
        id: 0,
        chat_id: chat.value?.id || 1,
        user_id: 2,
        message: 'Oi, tudo bem?',
        created_at: '2024-01-15T10:00:00Z',
        read_at: '2024-01-15T10:01:00Z'
      }
    ]
    
    messages.value = [...olderMessages, ...messages.value]
    hasMoreMessages.value = false // Simular que não há mais mensagens
    
  } catch (error) {
    console.error('Erro ao carregar mensagens antigas:', error)
    toast.error('Erro ao carregar mensagens antigas')
  } finally {
    loadingMore.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return
  
  try {
    sending.value = true
    
    const messageText = newMessage.value.trim()
    newMessage.value = ''
    
    // Adicionar mensagem otimisticamente
    const tempMessage: ChatMessage = {
      id: Date.now(), // ID temporário
      chat_id: chat.value?.id || 1,
      user_id: authStore.user?.id || 1,
      message: messageText,
      created_at: new Date().toISOString(),
      read_at: null
    }
    
    messages.value.push(tempMessage)
    
    // Scroll para baixo
    await nextTick()
    scrollToBottom()
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Atualizar com ID real da API
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.id = Math.floor(Math.random() * 1000) + 100
    
    toast.success('Mensagem enviada!')
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    toast.error('Erro ao enviar mensagem')
    
    // Remover mensagem em caso de erro
    messages.value.pop()
  } finally {
    sending.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleTyping = () => {
  // Simular indicador de digitação
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  typingTimeout = setTimeout(() => {
    // Parar indicador de digitação após 3 segundos
  }, 3000)
}

const handleScroll = () => {
  if (!messagesContainer.value) return
  
  const { scrollTop } = messagesContainer.value
  
  // Se chegou no topo e há mais mensagens, carregar automaticamente
  if (scrollTop === 0 && hasMoreMessages.value && !loadingMore.value) {
    loadMoreMessages()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const viewDonationItem = () => {
  router.push(`/donations/${chat.value?.donationItem.id}`)
}

const showUserProfile = () => {
  router.push(`/profile/${chat.value?.otherUser.id}`)
}
</script>

