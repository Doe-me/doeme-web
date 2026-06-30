<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button
            @click="$router.go(-1)"
            class="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('donations.create.title') }}</h1>
            <p class="mt-2 text-gray-600">{{ $t('donations.create.subtitle') }}</p>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                1
              </div>
              <span class="ml-2 text-sm font-medium text-blue-600">{{ $t('donations.create.stepInfo') }}</span>
            </div>
            <div class="w-16 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                2
              </div>
              <span class="ml-2 text-sm font-medium text-gray-600">{{ $t('donations.create.stepPhotos') }}</span>
            </div>
            <div class="w-16 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                3
              </div>
              <span class="ml-2 text-sm font-medium text-gray-600">{{ $t('donations.create.stepLocation') }}</span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ $t('donations.create.basicInfo') }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('donations.create.donationTitle') }} *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('donations.create.donationTitlePlaceholder')"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.title }"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('donations.create.category') }} *
              </label>
              <select
                id="category"
                v-model="form.category_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.category_id }"
              >
                <option value="">{{ $t('donations.create.selectCategory') }}</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
            </div>

            <!-- Condition -->
            <div>
              <label for="condition" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('donations.create.condition') }} *
              </label>
              <select
                id="condition"
                v-model="form.condition"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.condition }"
              >
                <option value="">{{ $t('donations.create.selectCondition') }}</option>
                <option value="new">{{ $t('donations.list.conditionNew') }}</option>
                <option value="like_new">{{ $t('donations.list.conditionLikeNew') }}</option>
                <option value="good">{{ $t('donations.list.conditionGood') }}</option>
                <option value="fair">{{ $t('donations.list.conditionFair') }}</option>
              </select>
              <p v-if="errors.condition" class="mt-1 text-sm text-red-600">{{ errors.condition }}</p>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('donations.create.description') }} *
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('donations.create.descriptionPlaceholder')"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ $t('donations.create.descriptionMinLength') }}</p>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ $t('donations.create.photosTitle') }}</h2>
          
          <!-- Image Upload Area -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <!-- Existing Images -->
            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <img
                :src="getImageUrl(image)"
                :alt="`Imagem ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Upload Button -->
            <button
              v-if="form.images.length < 5"
              type="button"
              @click="triggerFileUpload"
              class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <CameraIcon class="w-8 h-8 mb-2" />
              <span class="text-sm font-medium">Adicionar foto</span>
            </button>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleImageUpload"
            class="hidden"
          />
          
          <p class="text-sm text-gray-500">
            Adicione até 5 fotos. A primeira foto será a principal.
          </p>
          <p v-if="errors.images" class="mt-1 text-sm text-red-600">{{ errors.images }}</p>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Localização</h2>
          
          <div class="space-y-4">
            <!-- Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                Endereço *
              </label>
              <input
                id="address"
                v-model="form.location.address"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rua, número, bairro, cidade"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.address }"
              />
              <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
            </div>

            <!-- Use Current Location -->
            <div class="flex items-center">
              <button
                type="button"
                @click="getCurrentLocation"
                :disabled="gettingLocation"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <MapPinIcon class="w-4 h-4 mr-2" />
                {{ gettingLocation ? 'Obtendo localização...' : 'Usar localização atual' }}
              </button>
            </div>

            <!-- Map Preview (placeholder) -->
            <div class="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <MapIcon class="w-12 h-12 mx-auto mb-2" />
                <p>Prévia do mapa será exibida aqui</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Opções Adicionais</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="allow-pickup"
                v-model="form.allow_pickup"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="allow-pickup" class="ml-2 text-sm text-gray-700">
                Permitir retirada no local
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="allow-delivery"
                v-model="form.allow_delivery"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="allow-delivery" class="ml-2 text-sm text-gray-700">
                Posso entregar (raio de até 10km)
              </label>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.go(-1)"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
          >
            <span v-if="loading" class="inline-flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Publicando...
            </span>
            <span v-else>Publicar Doação</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import { useToast } from 'vue-toastification'
import {
  ArrowLeftIcon,
  CameraIcon,
  XMarkIcon,
  MapPinIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()

const loading = ref(false)
const gettingLocation = ref(false)
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  title: '',
  description: '',
  category_id: '',
  condition: '',
  images: [] as (File | string)[],
  location: {
    address: '',
    latitude: 0,
    longitude: 0
  },
  allow_pickup: true,
  allow_delivery: false
})

const errors = reactive({
  title: '',
  description: '',
  category_id: '',
  condition: '',
  images: '',
  address: ''
})

const categories = computed(() => categoriesStore.categories)

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Título é obrigatório'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória'
    isValid = false
  } else if (form.description.length < 20) {
    errors.description = 'Descrição deve ter pelo menos 20 caracteres'
    isValid = false
  }

  if (!form.category_id) {
    errors.category_id = 'Categoria é obrigatória'
    isValid = false
  }

  if (!form.condition) {
    errors.condition = 'Estado do item é obrigatório'
    isValid = false
  }

  if (form.images.length === 0) {
    errors.images = 'Pelo menos uma foto é obrigatória'
    isValid = false
  }

  if (!form.location.address.trim()) {
    errors.address = 'Endereço é obrigatório'
    isValid = false
  }

  return isValid
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (files.length + form.images.length > 5) {
    toast.error('Máximo de 5 fotos permitidas')
    return
  }
  
  form.images.push(...files)
  
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

const getImageUrl = (image: File | string) => {
  if (typeof image === 'string') {
    return image
  }
  return URL.createObjectURL(image)
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Geolocalização não é suportada pelo seu navegador')
    return
  }

  gettingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      form.location.latitude = position.coords.latitude
      form.location.longitude = position.coords.longitude
      
      // Here you would typically reverse geocode to get the address
      // For now, we'll just show a placeholder
      form.location.address = `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`
      
      gettingLocation.value = false
      toast.success('Localização obtida com sucesso!')
    },
    (error) => {
      gettingLocation.value = false
      toast.error('Erro ao obter localização: ' + error.message)
    }
  )
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const formData = new FormData()
    
    // Add basic fields
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category_id', form.category_id)
    formData.append('condition', form.condition)
    formData.append('location[address]', form.location.address)
    formData.append('location[latitude]', form.location.latitude.toString())
    formData.append('location[longitude]', form.location.longitude.toString())
    formData.append('allow_pickup', form.allow_pickup.toString())
    formData.append('allow_delivery', form.allow_delivery.toString())
    
    // Add images
    form.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images[${index}]`, image)
      }
    })

    await donationsStore.createItem(formData)
    
    toast.success('Doação publicada com sucesso!')
    router.push('/donations')
  } catch (error: any) {
    toast.error(error.message || 'Erro ao publicar doação')
    
    if (error.errors) {
      Object.assign(errors, error.errors)
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  }
})
</script>
