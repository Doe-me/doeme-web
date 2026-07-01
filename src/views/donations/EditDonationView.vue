<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Editar Doação</h1>
      <p class="text-gray-600">Atualize as informações da sua doação</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="donation" class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="updateDonation" class="space-y-6">
        <!-- Título -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Título da Doação *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Sofá em bom estado"
          />
        </div>

        <!-- Categoria -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="category"
            v-model="form.category_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        <!-- Descrição -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o item, seu estado de conservação e outras informações importantes..."
          ></textarea>
        </div>

        <!-- Condição -->
        <div>
          <label for="condition" class="block text-sm font-medium text-gray-700 mb-1">
            Estado de Conservação *
          </label>
          <select
            id="condition"
            v-model="form.condition"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o estado</option>
            <option value="novo">Novo</option>
            <option value="seminovo">Seminovo</option>
            <option value="usado">Usado</option>
            <option value="precisa_reparo">Precisa de reparo</option>
          </select>
        </div>

        <!-- Imagens -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fotos do Item
          </label>
          <p class="text-sm text-gray-500 mb-3">
            Adicione até 5 fotos para mostrar melhor o item
          </p>
          
          <!-- Imagens existentes -->
          <div v-if="form.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="relative group"
            >
              <img
                :src="image"
                :alt="`Imagem ${index + 1}`"
                class="w-full h-24 object-cover rounded-md border"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Upload de novas imagens -->
          <div
            v-if="form.images.length < 5"
            @click="$refs.imageInput.click()"
            @dragover.prevent
            @drop.prevent="handleImageDrop"
            class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              <span class="font-medium">Clique para adicionar</span> ou arraste imagens aqui
            </p>
            <p class="text-xs text-gray-500">PNG, JPG até 5MB cada</p>
          </div>

          <input
            ref="imageInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
        </div>

        <!-- Localização -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: São Paulo"
            />
          </div>
          
          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: SP"
            />
          </div>
        </div>

        <!-- Observações -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
            Observações Adicionais
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Informações sobre retirada, horários disponíveis, etc."
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
            Status da Doação
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
            <option value="donated">Doado</option>
          </select>
        </div>

        <!-- Botões -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          
          <router-link
            :to="{ name: 'donation-details', params: { id: donation.id } }"
            class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 text-center"
          >
            Cancelar
          </router-link>
        </div>
      </form>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Doação não encontrada</p>
      <router-link
        to="/donations"
        class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Ver Todas as Doações
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useDonationsStore } from '@/stores/donations'
import { useCategoriesStore } from '@/stores/categories'
import type { DonationItem } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const donationsStore = useDonationsStore()
const categoriesStore = useCategoriesStore()

const loading = ref(true)
const isSubmitting = ref(false)
const donation = ref<DonationItem | null>(null)

const form = ref({
  title: '',
  description: '',
  category_id: '',
  condition: '',
  images: [] as string[],
  city: '',
  state: '',
  notes: '',
  status: 'available'
})

const categories = computed(() => categoriesStore.categories)

onMounted(async () => {
  await loadDonation()
  await categoriesStore.fetchCategories()
})

const loadDonation = async () => {
  try {
    const donationId = route.params.id as string
    donation.value = await donationsStore.fetchDonation(donationId)
    
    if (donation.value) {
      // Preencher formulário com dados existentes
      form.value = {
        title: donation.value.title,
        description: donation.value.description,
        category_id: donation.value.category_id.toString(),
        condition: donation.value.condition,
        images: [...donation.value.images],
        city: donation.value.city,
        state: donation.value.state,
        notes: donation.value.notes || '',
        status: donation.value.status
      }
    }
  } catch (error) {
    toast.error('Erro ao carregar doação')
    router.push('/donations')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    Array.from(files).forEach(file => {
      if (form.value.images.length < 5) {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.images.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

const handleImageDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files) {
    Array.from(files).forEach(file => {
      if (form.value.images.length < 5 && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.images.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const updateDonation = async () => {
  if (!donation.value) return
  
  isSubmitting.value = true
  
  try {
    const updatedData = {
      ...form.value,
      category_id: parseInt(form.value.category_id)
    }
    
    await donationsStore.updateDonation(donation.value.id, updatedData)
    toast.success('Doação atualizada com sucesso!')
    
    router.push({ 
      name: 'donation-details', 
      params: { id: donation.value.id } 
    })
  } catch (error) {
    toast.error('Erro ao atualizar doação')
  } finally {
    isSubmitting.value = false
  }
}
</script>

