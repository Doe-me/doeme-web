<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header do Chat -->
    <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <router-link
          to="/chats"
          class="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </router-link>
        
        <div v-if="chat" class="flex items-center space-x-3">
          <div class="relative">
            <img
              :src="otherUser?.avatar || '/default-avatar.png'"
              :alt="otherUser?.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div
              v-if="otherUser?.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
            ></div>
          </div>
          
          <div>
            <h2 class="font-semibold text-gray-900">{{ otherUser?.name }}</h2>
            <p class="text-sm text-gray-600">
              {{ otherUser?.isOnline ? 'Online' : `Visto por último ${formatLastSeen(otherUser?.lastSeen)}` }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="toggleUserInfo"
          class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
        
        <div class="relative">
          <button
            @click="showOptions = !showOptions"
            class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          
          <div
            v-if="showOptions"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
          >
            <button
              @click="blockUser"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Bloquear usuário
            </button>
            <button
              @click="reportUser"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Denunciar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Área de Mensagens -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      @scroll="handleScroll"
    >
      <!-- Loading de mensagens antigas -->
      <div v-if="loadingOlderMessages" class="text-center py-2">
        <svg class="animate-spin h-6 w-6 text-primary-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
      
      <!-- Mensagens -->
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex',
          message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
            message.sender_id === currentUserId
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-900 border'
          ]"
        >
          <p class="text-sm">{{ message.content }}</p>
          <div
            :class="[
              'flex items-center justify-between mt-1 text-xs',
              message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-600'
            ]"
          >
            <span>{{ formatMessageTime(message.created_at) }}</span>
            <div
              v-if="message.sender_id === currentUserId"
              class="flex items-center space-x-1"
            >
              <svg
                v-if="message.status === 'sent'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else-if="message.status === 'delivered'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else-if="message.status === 'read'"
                class="w-3 h-3 text-blue-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicador de digitação -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-white border rounded-lg px-4 py-2 max-w-xs">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Input de Mensagem -->
    <div class="bg-white border-t p-4">
      <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
        <div class="flex-1">
          <textarea
            v-model="newMessage"
            @keydown="handleKeyDown"
            @input="handleTyping"
            placeholder="Digite sua mensagem..."
            rows="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style="min-height: 40px; max-height: 120px;"
          ></textarea>
        </div>
        
        <button
          type="submit"
          :disabled="!newMessage.trim() || isSending"
          class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isSending"
            class="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </form>
    </div>
    
    <!-- Sidebar de Informações do Usuário -->
    <div
      v-if="showUserInfo"
      class="fixed inset-y-0 right-0 w-80 bg-white border-l shadow-lg z-20 transform transition-transform lg:relative lg:w-1/3"
    >
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Informações</h3>
          <button
            @click="showUserInfo = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="otherUser" class="p-4 space-y-4">
        <div class="text-center">
          <img
            :src="otherUser.avatar || '/default-avatar.png'"
            :alt="otherUser.name"
            class="w-20 h-20 rounded-full object-cover mx-auto mb-3"
          />
          <h4 class="text-lg font-semibold">{{ otherUser.name }}</h4>
          <p class="text-sm text-gray-600">{{ otherUser.email }}</p>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">Avaliação</label>
            <div class="flex items-center space-x-1 mt-1">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-4 h-4',
                    i <= (otherUser.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span class="text-sm text-gray-600">
                ({{ otherUser.reviewsCount || 0 }} avaliações)
              </span>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">Localização</label>
            <p class="text-sm text-gray-600 mt-1">{{ otherUser.city }}, {{ otherUser.state }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">Membro desde</label>
            <p class="text-sm text-gray-600 mt-1">{{ formatDate(otherUser.created_at) }}</p>
          </div>
        </div>
        
        <div class="pt-4 border-t">
          <router-link
            :to="`/users/${otherUser.id}/reviews`"
            class="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700"
          >
            Ver Avaliações
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useChatsStore } from '@/stores/chats'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'
import type { Chat, ChatMessage, User } from '@/types'

const route = useRoute()
const toast = useToast()
const chatsStore = useChatsStore()
const authStore = useAuthStore()
const { handleError } = useErrorHandler()

const chat = ref<Chat | null>(null)
const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const showUserInfo = ref(false)
const showOptions = ref(false)
const loadingOlderMessages = ref(false)
const messagesContainer = ref<HTMLElement>()

let typingTimeout: NodeJS.Timeout | null = null

const currentUserId = computed(() => authStore.user?.id)
const otherUser = computed(() => {
  if (!chat.value || !currentUserId.value) return null
  return chat.value.participants.find(p => p.id !== currentUserId.value)
})

onMounted(async () => {
  await loadChat()
  await loadMessages()
  scrollToBottom()
  
  // Simular WebSocket para atualizações em tempo real
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})

const loadChat = async () => {
  try {
    const chatId = route.params.id as string
    chat.value = await chatsStore.fetchChat(chatId)
  } catch (error) {
    handleError(error, 'Erro ao carregar conversa')
  }
}

const loadMessages = async () => {
  try {
    const chatId = route.params.id as string
    messages.value = await chatsStore.fetchMessages(chatId)
  } catch (error) {
    handleError(error, 'Erro ao carregar mensagens')
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !chat.value) return

  isSending.value = true

  try {
    const message = await chatsStore.sendMessage(chat.value.id, newMessage.value.trim())
    messages.value.push(message)
    newMessage.value = ''

    await nextTick()
    scrollToBottom()
  } catch (error) {
    handleError(error, 'Erro ao enviar mensagem')
  } finally {
    isSending.value = false
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
    // Parar indicador de digitação
  }, 1000)
}

const handleScroll = () => {
  if (!messagesContainer.value) return
  
  const { scrollTop } = messagesContainer.value
  if (scrollTop === 0 && !loadingOlderMessages.value) {
    loadOlderMessages()
  }
}

const loadOlderMessages = async () => {
  loadingOlderMessages.value = true
  
  try {
    // Simular carregamento de mensagens antigas
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Adicionar mensagens antigas ao início do array
    // const olderMessages = await chatsStore.fetchOlderMessages(chat.value.id, messages.value[0]?.id)
    // messages.value.unshift(...olderMessages)
  } catch (error) {
    toast.error('Erro ao carregar mensagens antigas')
  } finally {
    loadingOlderMessages.value = false
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleUserInfo = () => {
  showUserInfo.value = !showUserInfo.value
}

const blockUser = () => {
  // Implementar bloqueio de usuário
  toast.success('Usuário bloqueado')
  showOptions.value = false
}

const reportUser = () => {
  // Implementar denúncia de usuário
  toast.success('Usuário denunciado')
  showOptions.value = false
}

const startRealtimeUpdates = () => {
  // Simular atualizações em tempo real
  setInterval(() => {
    // Simular nova mensagem ocasionalmente
    if (Math.random() < 0.1) {
      isTyping.value = true
      setTimeout(() => {
        isTyping.value = false
      }, 2000)
    }
  }, 5000)
}

const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }
}

const formatLastSeen = (timestamp?: string) => {
  if (!timestamp) return 'há muito tempo'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
  
  if (diffInMinutes < 1) return 'agora'
  if (diffInMinutes < 60) return `há ${Math.floor(diffInMinutes)} min`
  if (diffInMinutes < 1440) return `há ${Math.floor(diffInMinutes / 60)} h`
  return `há ${Math.floor(diffInMinutes / 1440)} dias`
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long'
  })
}
</script>

