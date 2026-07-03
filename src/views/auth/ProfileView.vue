<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p class="mt-2 text-gray-600">Gerencie suas informações pessoais e configurações da conta</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <!-- Avatar -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div
                  v-else
                  class="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                >
                  {{ user?.name?.charAt(0).toUpperCase() }}
                </div>
                <button
                  @click="triggerFileUpload"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <CameraIcon class="w-4 h-4" />
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarUpload"
                  class="hidden"
                />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ user?.name }}</h3>
              <p class="text-gray-600">{{ user?.email }}</p>
            </div>

            <!-- Stats -->
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <GiftIcon class="w-5 h-5 text-green-600 mr-2" />
                  <span class="text-sm font-medium text-gray-700">Doações</span>
                </div>
                <span class="text-lg font-bold text-green-600">{{ userStats.donations }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center">
                  <HeartIcon class="w-5 h-5 text-blue-600 mr-2" />
                  <span class="text-sm font-medium text-gray-700">Recebidas</span>
                </div>
                <span class="text-lg font-bold text-blue-600">{{ userStats.received }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div class="flex items-center">
                  <StarIcon class="w-5 h-5 text-yellow-600 mr-2" />
                  <span class="text-sm font-medium text-gray-700">Avaliação</span>
                </div>
                <span class="text-lg font-bold text-yellow-600">{{ userStats.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <div class="space-y-6">
            <!-- Personal Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
                <button
                  @click="editingPersonal = !editingPersonal"
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {{ editingPersonal ? 'Cancelar' : 'Editar' }}
                </button>
              </div>

              <form @submit.prevent="updatePersonalInfo" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      v-model="personalForm.name"
                      type="text"
                      :disabled="!editingPersonal"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      v-model="personalForm.email"
                      type="email"
                      :disabled="!editingPersonal"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      v-model="personalForm.phone"
                      type="tel"
                      :disabled="!editingPersonal"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input
                      v-model="personalForm.birth_date"
                      type="date"
                      :disabled="!editingPersonal"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    v-model="personalForm.bio"
                    rows="3"
                    :disabled="!editingPersonal"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Conte um pouco sobre você..."
                  ></textarea>
                </div>

                <div v-if="editingPersonal" class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="editingPersonal = false"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="loadingPersonal"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {{ loadingPersonal ? 'Salvando...' : 'Salvar' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Address Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Endereço</h2>
                <button
                  @click="editingAddress = !editingAddress"
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {{ editingAddress ? 'Cancelar' : 'Editar' }}
                </button>
              </div>

              <form @submit.prevent="updateAddress" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                    <input
                      v-model="addressForm.street"
                      type="text"
                      :disabled="!editingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      v-model="addressForm.number"
                      type="text"
                      :disabled="!editingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input
                      v-model="addressForm.neighborhood"
                      type="text"
                      :disabled="!editingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      v-model="addressForm.city"
                      type="text"
                      :disabled="!editingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                      v-model="addressForm.zip_code"
                      type="text"
                      :disabled="!editingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div v-if="editingAddress" class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="editingAddress = false"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="loadingAddress"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {{ loadingAddress ? 'Salvando...' : 'Salvar' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Security -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Segurança</h2>
              
              <div class="space-y-4">
                <button
                  @click="showChangePassword = true"
                  class="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <LockClosedIcon class="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p class="font-medium text-gray-900">Alterar Senha</p>
                        <p class="text-sm text-gray-600">Última alteração há 30 dias</p>
                      </div>
                    </div>
                    <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button class="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <ShieldCheckIcon class="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p class="font-medium text-gray-900">Autenticação em Duas Etapas</p>
                        <p class="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                      </div>
                    </div>
                    <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              required
              :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', passwordError ? 'border-red-500' : 'border-gray-300']"
              @input="passwordError = ''"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <input
              v-model="passwordForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <input
              v-model="passwordForm.password_confirmation"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closePasswordModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loadingPassword"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ loadingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {
  CameraIcon,
  GiftIcon,
  HeartIcon,
  StarIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)

const editingPersonal = ref(false)
const editingAddress = ref(false)
const showChangePassword = ref(false)

const loadingPersonal = ref(false)
const loadingAddress = ref(false)
const loadingPassword = ref(false)

const fileInput = ref<HTMLInputElement>()

const userStats = computed(() => ({
  donations: authStore.user?.donations_count ?? 0,
  received: authStore.user?.received_count ?? 0,
  rating: authStore.user?.average_rating ?? 0,
}))

const passwordError = ref('')

const personalForm = reactive({
  name: '',
  email: '',
  phone: '',
  birth_date: '',
  bio: ''
})

const addressForm = reactive({
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  zip_code: ''
})

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    try {
      await authStore.updateAvatar(file)
      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar avatar')
    }
  }
}

const updatePersonalInfo = async () => {
  loadingPersonal.value = true
  
  try {
    await authStore.updateProfile(personalForm)
    toast.success('Informações atualizadas com sucesso!')
    editingPersonal.value = false
  } catch (error) {
    toast.error(error.message || 'Erro ao atualizar informações')
  } finally {
    loadingPersonal.value = false
  }
}

const updateAddress = async () => {
  loadingAddress.value = true
  
  try {
    await authStore.updateAddress(addressForm)
    toast.success('Endereço atualizado com sucesso!')
    editingAddress.value = false
  } catch (error) {
    toast.error(error.message || 'Erro ao atualizar endereço')
  } finally {
    loadingAddress.value = false
  }
}

const closePasswordModal = () => {
  showChangePassword.value = false
  passwordError.value = ''
  Object.assign(passwordForm, { current_password: '', password: '', password_confirmation: '' })
}

const changePassword = async () => {
  if (passwordForm.password !== passwordForm.password_confirmation) {
    toast.error('As senhas não coincidem')
    return
  }

  loadingPassword.value = true
  passwordError.value = ''

  try {
    await authStore.changePassword(passwordForm)
    toast.success('Senha alterada com sucesso!')
    closePasswordModal()
  } catch (error) {
    const fieldError = (error as { response?: { data?: { errors?: { current_password?: string[] } } } }).response?.data?.errors?.current_password?.[0]
    if (fieldError) {
      passwordError.value = fieldError
    } else {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao alterar senha')
    }
  } finally {
    loadingPassword.value = false
  }
}

onMounted(() => {
  if (user.value) {
    Object.assign(personalForm, {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      birth_date: user.value.birth_date || '',
      bio: user.value.bio || ''
    })
    
    if (user.value.address) {
      Object.assign(addressForm, user.value.address)
    }
  }
})
</script>
