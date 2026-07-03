<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <ErrorState
        :description="error"
        @retry="loadChat"
      />
    </div>

    <!-- Chat Interface -->
    <div v-else-if="chat" class="flex flex-col h-screen">
      <!-- Header -->
      <div class="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 py-4 flex items-center justify-between">
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
            <img
              :src="otherUser?.avatar || '/default-avatar.png'"
              :alt="otherUser?.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ otherUser?.name }}</h2>
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
      <div v-if="donationItem" class="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-900 px-4 py-3">
        <div class="flex items-center space-x-3">
          <img
            :src="donationItem.images?.[0] || '/placeholder-image.jpg'"
            :alt="donationItem.title"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ donationItem.title }}</h3>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  statusClasses[donationItem.status]
                ]"
              >
                {{ statusLabels[donationItem.status] }}
              </span>
              <span class="text-sm text-gray-600">{{ donationItem.location }}</span>
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
                : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700'
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
      </div>

      <!-- Message Input -->
      <div class="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 px-4 py-4">
        <form @submit.prevent="handleSendMessage" class="flex items-end space-x-3">
          <div class="flex-1">
            <textarea
              v-model="newMessage"
              @keydown="handleKeyDown"
              placeholder="Digite sua mensagem..."
              rows="1"
              class="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
              style="min-height: 40px; max-height: 120px;"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="!newMessage.trim() || chatsStore.sending"
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
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatsStore } from '@/stores/chats'
import { useErrorHandler } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import {
  ArrowLeftIcon,
  GiftIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatsStore = useChatsStore()
const { handleError } = useErrorHandler()

const newMessage = ref('')
const hasMoreMessages = ref(false)
const loadingMore = ref(false)
const messagesPage = ref(1)
const messagesContainer = ref<HTMLElement>()

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

const chatId = computed(() => Number(route.params.id))
const chat = computed(() => chatsStore.currentChat)
const messages = computed(() => chatsStore.messages)
const loading = computed(() => chatsStore.loading)
const error = computed(() => chatsStore.error)
const donationItem = computed(() => chat.value?.donation_item)

const otherUser = computed(() => {
  if (!chat.value) return null
  return chat.value.donor_id === authStore.user?.id
    ? chat.value.interested_user
    : chat.value.donor
})

onMounted(async () => {
  await loadChat()
})

onUnmounted(() => {
  chatsStore.unsubscribeFromChat()
  chatsStore.clearCurrentChat()
})

const loadChat = async () => {
  try {
    chatsStore.clearError()
    await chatsStore.fetchChatById(chatId.value)
    const result = await chatsStore.fetchMessages(chatId.value, 1)
    messagesPage.value = 1
    hasMoreMessages.value = result.hasMore

    chatsStore.subscribeToChat(chatId.value)

    await nextTick()
    scrollToBottom()
  } catch (err) {
    handleError(err, 'Erro ao carregar conversa')
  }
}

const loadMoreMessages = async () => {
  try {
    loadingMore.value = true
    const result = await chatsStore.fetchMessages(chatId.value, messagesPage.value + 1)
    messagesPage.value += 1
    hasMoreMessages.value = result.hasMore
  } catch (err) {
    handleError(err, 'Erro ao carregar mensagens antigas')
  } finally {
    loadingMore.value = false
  }
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || chatsStore.sending) return

  const messageText = newMessage.value.trim()
  newMessage.value = ''

  try {
    await chatsStore.sendMessage(chatId.value, { message: messageText })
    await nextTick()
    scrollToBottom()
  } catch (err) {
    handleError(err, 'Erro ao enviar mensagem')
    newMessage.value = messageText
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
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

// Rola para o fim ao receber uma mensagem nova em tempo real
watch(() => messages.value.length, async () => {
  await nextTick()
  scrollToBottom()
})

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewDonationItem = () => {
  if (donationItem.value) {
    router.push(`/donations/${donationItem.value.id}`)
  }
}

const showUserProfile = () => {
  if (otherUser.value) {
    router.push(`/profile/${otherUser.value.id}`)
  }
}
</script>
