<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center">
        <button
          @click="$router.go(-1)"
          class="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Editar Doação</h1>
          <p class="mt-1 text-gray-600">Atualize as informações da sua doação</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <svg
          class="animate-spin w-10 h-10 text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <!-- Not found -->
      <div v-else-if="!donation" class="text-center py-20">
        <p class="text-gray-500 mb-4">Doação não encontrada.</p>
        <router-link
          to="/donations"
          class="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Ver Todas as Doações
        </router-link>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Título da Doação *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Sofá em bom estado"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.title }"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                v-model="form.category_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.category_id }"
              >
                <option value="">Selecione uma categoria</option>
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
                Estado de Conservação *
              </label>
              <select
                id="condition"
                v-model="form.condition"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.condition }"
              >
                <option value="">Selecione o estado</option>
                <option value="Novo">Novo</option>
                <option value="Usado - Excelente estado">Usado — Excelente estado</option>
                <option value="Usado - Bom estado">Usado — Bom estado</option>
                <option value="Usado - Estado regular">Usado — Estado regular</option>
              </select>
              <p v-if="errors.condition" class="mt-1 text-sm text-red-600">{{ errors.condition }}</p>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o item, seu estado de conservação e outras informações importantes..."
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Fotos</h2>

          <!-- Existing saved images (read-only) -->
          <div v-if="existingImages.length > 0" class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-3">
              Fotos já salvas ({{ existingImages.length }})
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div
                v-for="(img, index) in existingImages"
                :key="img.id"
                class="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  :src="img.url || img.path"
                  :alt="`Foto salva ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              A remoção individual de fotos já salvas estará disponível em breve.
            </p>
          </div>

          <!-- New images upload -->
          <div>
            <p class="text-sm font-medium text-gray-700 mb-3">
              Adicionar novas fotos
              <span v-if="slotsRemaining < 5" class="text-gray-400 font-normal">
                ({{ slotsRemaining }} slot(s) disponível/disponíveis)
              </span>
            </p>
            <ImageUpload
              v-model="newImages"
              :max-files="slotsRemaining"
              :max-size-mb="5"
            />
            <p v-if="errors.images" class="mt-2 text-sm text-red-600">{{ errors.images }}</p>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Localização</h2>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
              Endereço *
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, número, bairro, cidade"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.location }"
            />
            <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
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
            :disabled="isSubmitting"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            <span v-if="isSubmitting" class="inline-flex items-center">
              <svg
                class="animate-spin w-4 h-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </span>
            <span v-else>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import { useErrorHandler } from '@/utils/errorHandler'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import ImageUpload from '@/components/donations/ImageUpload.vue'
import type { DonationItem, DonationImage } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()
const { handleError } = useErrorHandler()

const loading = ref(true)
const isSubmitting = ref(false)
const donation = ref<DonationItem | null>(null)
const newImages = ref<File[]>([])

const form = reactive({
  title: '',
  description: '',
  category_id: '' as string | number,
  condition: '',
  location: '',
  allow_pickup: true,
  allow_delivery: false
})

const errors = reactive({
  title: '',
  description: '',
  category_id: '',
  condition: '',
  location: '',
  images: ''
})

const categories = computed(() => categoriesStore.categories)

const existingImages = computed<DonationImage[]>(() =>
  donation.value?.donation_images ?? []
)

const slotsRemaining = computed(() =>
  Math.max(0, 5 - existingImages.value.length)
)

const validateForm = () => {
  Object.keys(errors).forEach(k => {
    errors[k as keyof typeof errors] = ''
  })

  let valid = true

  if (!form.title.trim()) {
    errors.title = 'Título é obrigatório'
    valid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória'
    valid = false
  } else if (form.description.length < 20) {
    errors.description = 'Descrição deve ter pelo menos 20 caracteres'
    valid = false
  }

  if (!form.category_id) {
    errors.category_id = 'Categoria é obrigatória'
    valid = false
  }

  if (!form.condition) {
    errors.condition = 'Estado do item é obrigatório'
    valid = false
  }

  if (!form.location.trim()) {
    errors.location = 'Endereço é obrigatório'
    valid = false
  }

  return valid
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    await Promise.all([
      donationsStore.fetchItem(id),
      categoriesStore.fetchCategories()
    ])
    donation.value = donationsStore.currentItem

    if (donation.value) {
      form.title = donation.value.title
      form.description = donation.value.description
      form.category_id = donation.value.category_id
      form.condition = donation.value.condition
      form.location = donation.value.location ?? ''
      form.allow_pickup = donation.value.allow_pickup ?? true
      form.allow_delivery = donation.value.allow_delivery ?? false
    }
  } catch (error) {
    handleError(error, 'Erro ao carregar doação')
    router.push('/donations')
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!validateForm()) return
  if (!donation.value) return

  isSubmitting.value = true

  try {
    const payload = {
      title: form.title,
      description: form.description,
      category_id: form.category_id,
      condition: form.condition,
      location: form.location,
      allow_pickup: form.allow_pickup,
      allow_delivery: form.allow_delivery
    }

    await donationsStore.updateItem(String(donation.value.id), payload)

    if (newImages.value.length > 0) {
      try {
        await donationsStore.uploadImages(donation.value.id, newImages.value)
      } catch (uploadErr) {
        toast.warning('Dados salvos, mas houve um erro ao enviar as novas fotos.')
        handleError(uploadErr, 'Erro ao enviar fotos')
        router.push({ name: 'donation-details', params: { id: String(donation.value.id) } })
        return
      }
    }

    toast.success('Doação atualizada com sucesso!')
    router.push({ name: 'donation-details', params: { id: String(donation.value.id) } })
  } catch (error) {
    handleError(error, 'Erro ao atualizar doação')

    const apiError = error as { errors?: Record<string, string> }
    if (apiError.errors) {
      Object.assign(errors, apiError.errors)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
