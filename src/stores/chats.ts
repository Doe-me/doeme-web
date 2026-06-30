import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { getEcho } from '@/services/echo'
import type { Chat, ChatMessage, CreateChatRequest, SendMessageRequest } from '@/types'

export const useChatsStore = defineStore('chats', () => {
  // State
  const chats = ref<Chat[]>([])
  const currentChat = ref<Chat | null>(null)
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const sending = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalUnreadCount = computed(() => {
    return chats.value.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
  })

  const getChatById = computed(() => {
    return (id: number) => chats.value.find(chat => chat.id === id)
  })

  const getMessagesByChat = computed(() => {
    return (chatId: number) => messages.value.filter(message => message.chat_id === chatId)
  })

  // Actions
  const fetchChats = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/chats')
      chats.value = response.data.data || response.data
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar conversas'
      console.error('Erro ao buscar chats:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchChatById = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/chats/${id}`)
      currentChat.value = response.data.data || response.data
      
      return currentChat.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar conversa'
      console.error('Erro ao buscar chat:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMessages = async (chatId: number, page = 1) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/chats/${chatId}/messages`, {
        params: { page, per_page: 50 }
      })
      
      const newMessages = response.data.data || response.data
      
      if (page === 1) {
        messages.value = newMessages
      } else {
        // Adicionar mensagens antigas no início
        messages.value = [...newMessages, ...messages.value]
      }
      
      return {
        messages: newMessages,
        hasMore: response.data.meta?.has_more_pages || false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar mensagens'
      console.error('Erro ao buscar mensagens:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createChat = async (data: CreateChatRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/chats', data)
      const newChat = response.data.data || response.data
      
      chats.value.unshift(newChat)
      currentChat.value = newChat
      
      return newChat
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar conversa'
      console.error('Erro ao criar chat:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (chatId: number, data: SendMessageRequest) => {
    try {
      sending.value = true
      error.value = null
      
      const response = await api.post(`/chats/${chatId}/messages`, data)
      const newMessage = response.data.data || response.data
      
      // Adicionar mensagem à lista
      messages.value.push(newMessage)
      
      // Atualizar última mensagem do chat
      const chatIndex = chats.value.findIndex(chat => chat.id === chatId)
      if (chatIndex !== -1) {
        chats.value[chatIndex].lastMessage = newMessage
        chats.value[chatIndex].updated_at = newMessage.created_at
        
        // Mover chat para o topo da lista
        const chat = chats.value.splice(chatIndex, 1)[0]
        chats.value.unshift(chat)
      }
      
      return newMessage
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao enviar mensagem'
      console.error('Erro ao enviar mensagem:', err)
      throw err
    } finally {
      sending.value = false
    }
  }

  const markAsRead = async (chatId: number) => {
    try {
      await api.post(`/chats/${chatId}/mark-as-read`)
      
      // Atualizar contador de não lidas
      const chatIndex = chats.value.findIndex(chat => chat.id === chatId)
      if (chatIndex !== -1) {
        chats.value[chatIndex].unreadCount = 0
      }
      
      // Marcar mensagens como lidas
      messages.value
        .filter(message => message.chat_id === chatId && !message.read_at)
        .forEach(message => {
          message.read_at = new Date().toISOString()
        })
        
    } catch (err: any) {
      console.error('Erro ao marcar como lida:', err)
    }
  }

  const deleteChat = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      await api.delete(`/chats/${id}`)
      
      // Remover chat da lista
      chats.value = chats.value.filter(chat => chat.id !== id)
      
      // Limpar chat atual se for o mesmo
      if (currentChat.value?.id === id) {
        currentChat.value = null
      }
      
      // Remover mensagens do chat
      messages.value = messages.value.filter(message => message.chat_id !== id)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir conversa'
      console.error('Erro ao excluir chat:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentChat = () => {
    currentChat.value = null
    messages.value = []
  }

  // Real-time updates (mensagens recebidas via WebSocket - Laravel Echo/Reverb)
  const addMessage = (message: ChatMessage) => {
    // Evita duplicar mensagem já adicionada otimisticamente pelo próprio remetente
    if (messages.value.some(existing => existing.id === message.id)) {
      return
    }

    messages.value.push(message)

    // Atualizar última mensagem do chat
    const chatIndex = chats.value.findIndex(chat => chat.id === message.chat_id)
    if (chatIndex !== -1) {
      chats.value[chatIndex].lastMessage = message
      chats.value[chatIndex].updated_at = message.created_at

      // Incrementar contador de não lidas se não for do usuário atual
      if (message.user_id !== currentChat.value?.otherUser?.id) {
        chats.value[chatIndex].unreadCount = (chats.value[chatIndex].unreadCount || 0) + 1
      }

      // Mover chat para o topo da lista
      const chat = chats.value.splice(chatIndex, 1)[0]
      chats.value.unshift(chat)
    }
  }

  let subscribedChatId: number | null = null

  /**
   * Escuta o canal privado do chat e adiciona novas mensagens em tempo real,
   * sem precisar dar refresh/poll na página (evento "message.sent" da API).
   */
  const subscribeToChat = (chatId: number) => {
    if (subscribedChatId === chatId) {
      return
    }

    unsubscribeFromChat()

    getEcho()
      .private(`chat.${chatId}`)
      .listen('.message.sent', (payload: {
        id: number
        chat_id: number
        message: string
        user: { id: number; name: string; avatar?: string }
        created_at: string
      }) => {
        addMessage({
          id: payload.id,
          chat_id: payload.chat_id,
          user_id: payload.user.id,
          message: payload.message,
          created_at: payload.created_at,
          user: payload.user as ChatMessage['user'],
        })
      })

    subscribedChatId = chatId
  }

  const unsubscribeFromChat = () => {
    if (subscribedChatId === null) {
      return
    }

    getEcho().leave(`chat.${subscribedChatId}`)
    subscribedChatId = null
  }

  const updateUserOnlineStatus = (userId: number, isOnline: boolean) => {
    // Atualizar status online do usuário em todos os chats
    chats.value.forEach(chat => {
      if (chat.otherUser.id === userId) {
        chat.otherUser.isOnline = isOnline
      }
    })
    
    // Atualizar no chat atual
    if (currentChat.value?.otherUser.id === userId) {
      currentChat.value.otherUser.isOnline = isOnline
    }
  }

  return {
    // State
    chats,
    currentChat,
    messages,
    loading,
    sending,
    error,
    
    // Getters
    totalUnreadCount,
    getChatById,
    getMessagesByChat,
    
    // Actions
    fetchChats,
    fetchChatById,
    fetchMessages,
    createChat,
    sendMessage,
    markAsRead,
    deleteChat,
    clearError,
    clearCurrentChat,
    addMessage,
    updateUserOnlineStatus,
    subscribeToChat,
    unsubscribeFromChat
  }
})

