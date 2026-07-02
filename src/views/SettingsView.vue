<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Configurações</h1>
    
    <div class="grid lg:grid-cols-4 gap-6">
      <!-- Menu Lateral -->
      <div class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow-md p-4">
          <ul class="space-y-2">
            <li>
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md transition-colors',
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                👤 Perfil
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'notifications'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md transition-colors',
                  activeTab === 'notifications' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                🔔 Notificações
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'privacy'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md transition-colors',
                  activeTab === 'privacy' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                🔒 Privacidade
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'account'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md transition-colors',
                  activeTab === 'account' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                ⚙️ Conta
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- Conteúdo Principal -->
      <div class="lg:col-span-3">
        <!-- Configurações de Perfil -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Informações do Perfil</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="flex items-center space-x-4 mb-6">
              <div class="relative">
                <img
                  :src="profileForm.avatar || '/default-avatar.png'"
                  alt="Avatar"
                  class="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  @click="$refs.avatarInput.click()"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
                >
                  📷
                </button>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
              </div>
              <div>
                <h3 class="font-medium">Foto do Perfil</h3>
                <p class="text-sm text-gray-600">Clique no ícone para alterar</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  v-model="profileForm.city"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                v-model="profileForm.bio"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Conte um pouco sobre você..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              :disabled="isUpdating"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </form>
        </div>
        
        <!-- Configurações de Notificações -->
        <div v-if="activeTab === 'notifications'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Preferências de Notificação</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium mb-3">E-mail</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.email.newMessages"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Novas mensagens</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.email.donationUpdates"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Atualizações de doações</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.email.newsletter"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Newsletter semanal</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium mb-3">Push Notifications</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.push.newMessages"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Novas mensagens</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.push.donationInterest"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Interesse em suas doações</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="notificationSettings.push.newReviews"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Novas avaliações</span>
                </label>
              </div>
            </div>
            
            <button
              @click="updateNotifications"
              :disabled="isUpdating"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isUpdating ? 'Salvando...' : 'Salvar Preferências' }}
            </button>
          </div>
        </div>
        
        <!-- Configurações de Privacidade -->
        <div v-if="activeTab === 'privacy'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Configurações de Privacidade</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium mb-3">Visibilidade do Perfil</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.showEmail"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Mostrar e-mail no perfil público</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.showPhone"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Mostrar telefone no perfil público</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.showLocation"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Mostrar localização aproximada</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium mb-3">Comunicação</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.allowMessages"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Permitir mensagens de outros usuários</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.onlineStatus"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2">Mostrar status online</span>
                </label>
              </div>
            </div>
            
            <button
              @click="updatePrivacy"
              :disabled="isUpdating"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isUpdating ? 'Salvando...' : 'Salvar Configurações' }}
            </button>
          </div>
        </div>
        
        <!-- Configurações de Conta -->
        <div v-if="activeTab === 'account'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Configurações da Conta</h2>
          
          <div class="space-y-6">
            <!-- Alterar Senha -->
            <div>
              <h3 class="text-lg font-medium mb-3">Alterar Senha</h3>
              <form @submit.prevent="changePassword" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isUpdating ? 'Alterando...' : 'Alterar Senha' }}
                </button>
              </form>
            </div>
            
            <!-- Contas Conectadas -->
            <div>
              <h3 class="text-lg font-medium mb-3">Contas Conectadas</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 border rounded-md">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">📘</span>
                    <div>
                      <p class="font-medium">Facebook</p>
                      <p class="text-sm text-gray-600">Conectado</p>
                    </div>
                  </div>
                  <button class="text-red-600 hover:text-red-700">Desconectar</button>
                </div>
                
                <div class="flex items-center justify-between p-3 border rounded-md">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">🔍</span>
                    <div>
                      <p class="font-medium">Google</p>
                      <p class="text-sm text-gray-600">Não conectado</p>
                    </div>
                  </div>
                  <button class="text-blue-600 hover:text-blue-700">Conectar</button>
                </div>
              </div>
            </div>
            
            <!-- Zona de Perigo -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-red-600 mb-3">Zona de Perigo</h3>
              <div class="space-y-3">
                <button
                  @click="showDeleteModal = true"
                  class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Excluir Conta
                </button>
                <p class="text-sm text-gray-600">
                  Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão da Conta</h3>
        <p class="text-gray-600 mb-4">
          Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
        </p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const authStore = useAuthStore()

const activeTab = ref('profile')
const isUpdating = ref(false)
const showDeleteModal = ref(false)

const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  avatar: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = ref({
  email: {
    newMessages: true,
    donationUpdates: true,
    newsletter: false
  },
  push: {
    newMessages: true,
    donationInterest: true,
    newReviews: false
  }
})

const privacySettings = ref({
  showEmail: false,
  showPhone: false,
  showLocation: true,
  allowMessages: true,
  onlineStatus: true
})

onMounted(() => {
  loadUserData()
})

const loadUserData = () => {
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      city: authStore.user.city || '',
      bio: authStore.user.bio || '',
      avatar: authStore.user.avatar || ''
    }
  }
}

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileForm.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const updateProfile = async () => {
  isUpdating.value = true
  try {
    await authStore.updateProfile(profileForm.value)
    toast.success('Perfil atualizado com sucesso!')
  } catch {
    toast.error('Erro ao atualizar perfil')
  } finally {
    isUpdating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('As senhas não coincidem')
    return
  }
  
  isUpdating.value = true
  try {
    // Simular mudança de senha
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Senha alterada com sucesso!')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch {
    toast.error('Erro ao alterar senha')
  } finally {
    isUpdating.value = false
  }
}

const updateNotifications = async () => {
  isUpdating.value = true
  try {
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Preferências de notificação atualizadas!')
  } catch {
    toast.error('Erro ao atualizar preferências')
  } finally {
    isUpdating.value = false
  }
}

const updatePrivacy = async () => {
  isUpdating.value = true
  try {
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Configurações de privacidade atualizadas!')
  } catch {
    toast.error('Erro ao atualizar configurações')
  } finally {
    isUpdating.value = false
  }
}

const deleteAccount = async () => {
  try {
    // Simular exclusão
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Conta excluída com sucesso')
    await authStore.logout()
    // Redirecionar para home
  } catch {
    toast.error('Erro ao excluir conta')
  }
  showDeleteModal.value = false
}
</script>

