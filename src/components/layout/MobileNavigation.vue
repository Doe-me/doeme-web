<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
    <div class="grid grid-cols-5 h-16">
      <router-link
        v-for="item in navigationItems"
        :key="item.href"
        :to="item.href"
        class="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors duration-200"
        :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'"
      >
        <component
          :is="item.icon"
          class="h-6 w-6"
          :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-400'"
        />
        <span>{{ item.label }}</span>
        
        <!-- Badge para notificações -->
        <div
          v-if="item.badge && item.badge > 0"
          class="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 rounded-full flex items-center justify-center"
        >
          <span class="text-xs font-medium text-white">
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </div>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  HomeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import {
  HomeIcon as HomeIconSolid,
  HeartIcon as HeartIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserIcon as UserIconSolid,
  PlusIcon as PlusIconSolid
} from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

const navigationItems = computed(() => [
  {
    label: t('mobileNav.home'),
    href: '/',
    icon: isActive('/') ? HomeIconSolid : HomeIcon,
  },
  {
    label: t('mobileNav.donations'),
    href: '/donations',
    icon: isActive('/donations') ? HeartIconSolid : HeartIcon,
  },
  {
    label: t('mobileNav.create'),
    href: isAuthenticated.value ? '/donations/create' : '/login',
    icon: isActive('/donations/create') ? PlusIconSolid : PlusIcon,
  },
  {
    label: t('mobileNav.chat'),
    href: isAuthenticated.value ? '/chats' : '/login',
    icon: isActive('/chats') ? ChatBubbleLeftRightIconSolid : ChatBubbleLeftRightIcon,
    badge: 0, // TODO: Implementar contagem de mensagens não lidas
  },
  {
    label: t('mobileNav.profile'),
    href: isAuthenticated.value ? '/profile' : '/login',
    icon: isActive('/profile') ? UserIconSolid : UserIcon,
  },
])

// Methods
const isActive = (href: string): boolean => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}
</script>

