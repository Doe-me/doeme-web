<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div class="animate-spin rounded-full border-b-2" :class="sizeClass"></div>
    </div>
    <p v-if="text" :class="textClass">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'gray' | 'white'
  text?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'blue',
  centered: true
})

const containerClass = computed(() => [
  props.centered ? 'flex flex-col items-center justify-center' : '',
  'space-y-2'
])

const spinnerClass = computed(() => [
  'inline-block'
])

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const colors = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  }
  
  return `${sizes[props.size]} ${colors[props.color]}`
})

const textClass = computed(() => [
  'text-sm',
  props.color === 'white' ? 'text-white' : 'text-gray-600'
])
</script>

