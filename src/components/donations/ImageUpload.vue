<template>
  <div>
    <!-- Drop zone -->
    <div
      v-if="modelValue.length < maxFiles"
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'rounded-lg border-2 border-dashed cursor-pointer transition-colors',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      ]"
      class="p-6 flex flex-col items-center justify-center text-center"
    >
      <svg
        class="w-10 h-10 text-gray-400 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p class="text-sm font-medium text-gray-700">
        <span class="text-primary-600">Clique para selecionar</span> ou arraste imagens aqui
      </p>
      <p class="mt-1 text-xs text-gray-500">
        JPG, JPEG, PNG, WebP ou GIF — até {{ maxSizeMb }}MB por arquivo, máximo {{ maxFiles }} fotos
      </p>
    </div>

    <input
      ref="inputRef"
      type="file"
      multiple
      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Validation errors -->
    <div v-if="validationErrors.length > 0" class="mt-2 space-y-1">
      <p
        v-for="(err, i) in validationErrors"
        :key="i"
        class="text-sm text-red-600"
      >
        {{ err }}
      </p>
    </div>

    <!-- Preview grid -->
    <div
      v-if="modelValue.length > 0"
      class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
    >
      <div
        v-for="(file, index) in modelValue"
        :key="index"
        class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
      >
        <img
          :src="previews[index]"
          :alt="`Foto ${index + 1}`"
          class="w-full h-full object-cover"
        />
        <button
          type="button"
          @click.stop="removeFile(index)"
          class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          :aria-label="`Remover foto ${index + 1}`"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
        </button>
        <div class="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
          <p class="text-white text-xs truncate">{{ file.name }}</p>
        </div>
      </div>
    </div>

    <p v-if="modelValue.length > 0" class="mt-2 text-xs text-gray-500">
      {{ modelValue.length }}/{{ maxFiles }} foto(s) selecionada(s)
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: File[]
  maxFiles?: number
  maxSizeMb?: number
}>(), {
  maxFiles: 5,
  maxSizeMb: 5
})

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void
}>()

const inputRef = ref<HTMLInputElement>()
const isDragging = ref(false)
const validationErrors = ref<string[]>([])
const previews = ref<string[]>([])

// Revoke object URLs when component unmounts or previews change
const revokeAll = () => {
  previews.value.forEach(url => URL.revokeObjectURL(url))
}

onBeforeUnmount(revokeAll)

watch(
  () => props.modelValue,
  (files) => {
    revokeAll()
    previews.value = files.map(f => URL.createObjectURL(f))
  },
  { immediate: true }
)

const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = props.maxSizeMb * 1024 * 1024

const validate = (incoming: File[]): { valid: File[]; errors: string[] } => {
  const errors: string[] = []
  const valid: File[] = []
  const remaining = props.maxFiles - props.modelValue.length

  if (incoming.length > remaining) {
    errors.push(`Você pode adicionar no máximo ${remaining} foto(s) mais.`)
    incoming = incoming.slice(0, remaining)
  }

  for (const file of incoming) {
    if (!ALLOWED_MIMES.includes(file.type)) {
      errors.push(`"${file.name}" não é um formato suportado (use JPG, PNG, WebP ou GIF).`)
      continue
    }
    if (file.size > MAX_BYTES) {
      errors.push(`"${file.name}" ultrapassa ${props.maxSizeMb}MB.`)
      continue
    }
    valid.push(file)
  }

  return { valid, errors }
}

const triggerInput = () => {
  inputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  processFiles(files)
  // Reset so same files can be re-added if removed
  input.value = ''
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || []).filter(f =>
    f.type.startsWith('image/')
  )
  processFiles(files)
}

const processFiles = (files: File[]) => {
  const { valid, errors } = validate(files)
  validationErrors.value = errors
  if (valid.length > 0) {
    emit('update:modelValue', [...props.modelValue, ...valid])
  }
}

const removeFile = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
  validationErrors.value = []
}
</script>
