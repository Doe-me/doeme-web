<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Configurações</h1>
        <p class="mt-2 text-gray-600">Gerencie suas preferências e dados da conta</p>
      </div>

      <div class="grid lg:grid-cols-4 gap-6">
        <!-- Menu Lateral -->
        <div class="lg:col-span-1">
          <nav class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <ul class="space-y-1">
              <li v-for="tab in tabs" :key="tab.id">
                <button
                  @click="activeTab = tab.id"
                  :class="[
                    'w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <component :is="tab.icon" class="w-4 h-4 mr-2 flex-shrink-0" />
                  {{ tab.label }}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Conteúdo Principal -->
        <div class="lg:col-span-3">

          <!-- Perfil -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Informações do Perfil</h2>

            <form @submit.prevent="updateProfile" class="space-y-5">
              <!-- Avatar -->
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <img
                    v-if="avatarPreview || profileForm.avatar"
                    :src="avatarPreview || profileForm.avatar"
                    alt="Avatar"
                    class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div
                    v-else
                    class="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold"
                  >
                    {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                  </div>
                  <button
                    type="button"
                    @click="(avatarInputRef as HTMLInputElement)?.click()"
                    class="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors"
                  >
                    <CameraIcon class="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/*"
                    @change="handleAvatarChange"
                    class="hidden"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Foto do Perfil</p>
                  <p class="text-sm text-gray-600">JPG, PNG até 2MB</p>
                  <button
                    v-if="pendingAvatarFile"
                    type="button"
                    :disabled="uploadingAvatar"
                    @click="uploadAvatar"
                    class="mt-1 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                  >
                    {{ uploadingAvatar ? 'Enviando...' : 'Salvar foto' }}
                  </button>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <input
                    v-model="profileForm.location"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="savingProfile"
                  class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {{ savingProfile ? 'Salvando...' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Senha -->
          <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Alterar Senha</h2>

            <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500', passwordError ? 'border-red-500' : 'border-gray-300']"
                  @input="passwordError = ''"
                />
                <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="savingPassword"
                  class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {{ savingPassword ? 'Alterando...' : 'Alterar Senha' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Notificações -->
          <div v-if="activeTab === 'notifications'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Preferências de Notificação</h2>

            <div v-if="loadingNotifications" class="flex justify-center py-8">
              <LoadingSpinner />
            </div>

            <div v-else class="space-y-6">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">E-mail</h3>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Novas mensagens</span>
                    <input v-model="notifications.email_new_message" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Interesse em suas doações</span>
                    <input v-model="notifications.email_donation_interest" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Newsletter semanal</span>
                    <input v-model="notifications.email_newsletter" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Push</h3>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Novas mensagens</span>
                    <input v-model="notifications.push_new_message" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Interesse em suas doações</span>
                    <input v-model="notifications.push_donation_interest" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Novas avaliações</span>
                    <input v-model="notifications.push_new_reviews" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  @click="saveNotifications"
                  :disabled="savingNotifications"
                  class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {{ savingNotifications ? 'Salvando...' : 'Salvar Preferências' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Privacidade -->
          <div v-if="activeTab === 'privacy'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Configurações de Privacidade</h2>

            <div v-if="loadingPrivacy" class="flex justify-center py-8">
              <LoadingSpinner />
            </div>

            <div v-else class="space-y-6">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Visibilidade</h3>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Mostrar e-mail no perfil público</span>
                    <input v-model="privacy.show_email" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Mostrar telefone no perfil público</span>
                    <input v-model="privacy.show_phone" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Mostrar localização aproximada</span>
                    <input v-model="privacy.show_location" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Comunicação</h3>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Permitir mensagens de outros usuários</span>
                    <input v-model="privacy.allow_messages" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-700">Mostrar status online</span>
                    <input v-model="privacy.online_status" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  @click="savePrivacy"
                  :disabled="savingPrivacy"
                  class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {{ savingPrivacy ? 'Salvando...' : 'Salvar Configurações' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Conta -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <!-- Contas Conectadas -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Contas Conectadas</h2>

              <div v-if="loadingConnected" class="flex justify-center py-4">
                <LoadingSpinner />
              </div>

              <div v-else class="space-y-3">
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-xs font-bold">f</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Facebook</p>
                      <p :class="['text-sm', connectedAccounts.facebook ? 'text-green-600' : 'text-gray-500']">
                        {{ connectedAccounts.facebook ? 'Conectado' : 'Não conectado' }}
                      </p>
                    </div>
                  </div>
                  <button
                    v-if="connectedAccounts.facebook"
                    class="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    @click="toast.info('Desconexão de conta social será implementada')"
                  >
                    Desconectar
                  </button>
                  <button
                    v-else
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    @click="authStore.socialLogin('facebook')"
                  >
                    Conectar
                  </button>
                </div>

                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-xs font-bold">G</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Google</p>
                      <p :class="['text-sm', connectedAccounts.google ? 'text-green-600' : 'text-gray-500']">
                        {{ connectedAccounts.google ? 'Conectado' : 'Não conectado' }}
                      </p>
                    </div>
                  </div>
                  <button
                    v-if="connectedAccounts.google"
                    class="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    @click="toast.info('Desconexão de conta social será implementada')"
                  >
                    Desconectar
                  </button>
                  <button
                    v-else
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    @click="authStore.socialLogin('google')"
                  >
                    Conectar
                  </button>
                </div>
              </div>
            </div>

            <!-- Zona de Perigo -->
            <div class="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <h2 class="text-xl font-semibold text-red-600 mb-2">Zona de Perigo</h2>
              <p class="text-sm text-gray-600 mb-4">
                Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
              </p>
              <button
                @click="showDeleteModal = true"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Excluir Conta
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Excluir Conta -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão da Conta</h3>
        <p class="text-gray-600 mb-4 text-sm">
          Tem certeza? Esta ação não pode ser desfeita. Digite sua senha para confirmar.
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="deletePasswordInput"
            type="password"
            :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500', deletePasswordError ? 'border-red-500' : 'border-gray-300']"
            placeholder="Digite sua senha"
            @input="deletePasswordError = ''"
          />
          <p v-if="deletePasswordError" class="mt-1 text-sm text-red-600">{{ deletePasswordError }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="deleteAccount"
            :disabled="deletingAccount || !deletePasswordInput"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ deletingAccount ? 'Excluindo...' : 'Excluir Conta' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {
  UserIcon,
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CameraIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const tabs = [
  { id: 'profile', label: 'Perfil', icon: UserIcon },
  { id: 'password', label: 'Senha', icon: LockClosedIcon },
  { id: 'notifications', label: 'Notificações', icon: BellIcon },
  { id: 'privacy', label: 'Privacidade', icon: ShieldCheckIcon },
  { id: 'account', label: 'Conta', icon: Cog6ToothIcon },
]

const activeTab = ref('profile')

// --- Profile ---
const savingProfile = ref(false)
const uploadingAvatar = ref(false)
const avatarInputRef = ref<HTMLInputElement>()
const avatarPreview = ref('')
const pendingAvatarFile = ref<File | null>(null)

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  location: '',
  avatar: '',
})

const loadProfileData = () => {
  if (authStore.user) {
    Object.assign(profileForm, {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      location: authStore.user.location || '',
      avatar: authStore.user.avatar || '',
    })
  }
}

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    pendingAvatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => { avatarPreview.value = e.target?.result as string }
    reader.readAsDataURL(file)
  }
}

const uploadAvatar = async () => {
  if (!pendingAvatarFile.value) return
  uploadingAvatar.value = true
  try {
    await authStore.updateAvatar(pendingAvatarFile.value)
    pendingAvatarFile.value = null
    profileForm.avatar = authStore.user?.avatar || ''
    toast.success('Foto atualizada com sucesso!')
  } catch {
    toast.error('Erro ao enviar foto')
  } finally {
    uploadingAvatar.value = false
  }
}

const updateProfile = async () => {
  savingProfile.value = true
  try {
    await authStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      location: profileForm.location,
    })
    toast.success('Perfil atualizado com sucesso!')
  } catch {
    toast.error('Erro ao atualizar perfil')
  } finally {
    savingProfile.value = false
  }
}

// --- Password ---
const savingPassword = ref(false)
const passwordError = ref('')
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('As senhas não coincidem')
    return
  }
  savingPassword.value = true
  passwordError.value = ''
  try {
    await authStore.changePassword({
      current_password: passwordForm.currentPassword,
      password: passwordForm.newPassword,
      password_confirmation: passwordForm.confirmPassword,
    })
    toast.success('Senha alterada com sucesso!')
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  } catch (err) {
    const fieldError = (err as { response?: { data?: { errors?: { current_password?: string[] } } } }).response?.data?.errors?.current_password?.[0]
    if (fieldError) {
      passwordError.value = fieldError
    } else if (!(err as { response?: { data?: { errors?: unknown } } }).response?.data?.errors) {
      toast.error('Erro ao alterar senha')
    }
  } finally {
    savingPassword.value = false
  }
}

// --- Notifications ---
const loadingNotifications = ref(false)
const savingNotifications = ref(false)
const notifications = reactive({
  email_new_message: true,
  email_donation_interest: true,
  email_newsletter: false,
  push_new_message: true,
  push_donation_interest: true,
  push_new_reviews: false,
})

const loadNotifications = async () => {
  loadingNotifications.value = true
  try {
    const prefs = await authStore.getNotificationPreferences()
    Object.assign(notifications, prefs)
  } catch {
    toast.error('Erro ao carregar preferências')
  } finally {
    loadingNotifications.value = false
  }
}

const saveNotifications = async () => {
  savingNotifications.value = true
  try {
    await authStore.updateNotificationPreferences({ ...notifications })
    toast.success('Preferências de notificação atualizadas!')
  } catch {
    toast.error('Erro ao salvar preferências')
  } finally {
    savingNotifications.value = false
  }
}

// --- Privacy ---
const loadingPrivacy = ref(false)
const savingPrivacy = ref(false)
const privacy = reactive({
  show_email: false,
  show_phone: false,
  show_location: true,
  allow_messages: true,
  online_status: true,
})

const loadPrivacy = async () => {
  loadingPrivacy.value = true
  try {
    const settings = await authStore.getPrivacySettings()
    Object.assign(privacy, settings)
  } catch {
    toast.error('Erro ao carregar configurações')
  } finally {
    loadingPrivacy.value = false
  }
}

const savePrivacy = async () => {
  savingPrivacy.value = true
  try {
    await authStore.updatePrivacySettings({ ...privacy })
    toast.success('Configurações de privacidade atualizadas!')
  } catch {
    toast.error('Erro ao salvar configurações')
  } finally {
    savingPrivacy.value = false
  }
}

// --- Connected Accounts ---
const loadingConnected = ref(false)
const connectedAccounts = reactive({ google: false, facebook: false })

const loadConnectedAccounts = async () => {
  loadingConnected.value = true
  try {
    const accounts = await authStore.getConnectedAccounts()
    Object.assign(connectedAccounts, accounts)
  } catch {
    // silently fail — not critical
  } finally {
    loadingConnected.value = false
  }
}

// --- Delete Account ---
const showDeleteModal = ref(false)
const deletingAccount = ref(false)
const deletePasswordInput = ref('')
const deletePasswordError = ref('')

const cancelDelete = () => {
  showDeleteModal.value = false
  deletePasswordInput.value = ''
  deletePasswordError.value = ''
}

const deleteAccount = async () => {
  deletingAccount.value = true
  deletePasswordError.value = ''
  try {
    await authStore.deleteAccount({ password: deletePasswordInput.value })
    toast.success('Conta excluída com sucesso')
    router.push('/')
  } catch (err) {
    const fieldError = (err as { response?: { data?: { errors?: { password?: string[] } } } }).response?.data?.errors?.password?.[0]
    if (fieldError) {
      deletePasswordError.value = fieldError
    } else {
      toast.error('Erro ao excluir conta')
    }
  } finally {
    deletingAccount.value = false
  }
}

// Load data when switching tabs
watch(activeTab, (tab) => {
  if (tab === 'notifications') loadNotifications()
  if (tab === 'privacy') loadPrivacy()
  if (tab === 'account') loadConnectedAccounts()
})

onMounted(() => {
  loadProfileData()
})
</script>
