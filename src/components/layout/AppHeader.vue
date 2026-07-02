<template>
  <!-- Offline Banner -->
  <div
    v-if="!isOnline"
    class="bg-yellow-500 text-white text-center text-sm py-1.5 px-4 sticky top-0 z-50"
  >
    Você está offline. Algumas funcionalidades podem estar indisponíveis.
  </div>

  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" :class="{ 'top-8': !isOnline }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo e Nome -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <HeartIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 hidden sm:block">{{ $t('common.appName') }}</span>
          </router-link>
        </div>

        <!-- Navegação Desktop -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === item.href }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Ações do Usuário -->
        <div class="flex items-center space-x-4">
          <!-- Busca -->
          <div class="hidden sm:block relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('nav.searchPlaceholder')"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- Instalar PWA -->
          <button
            v-if="isInstallable"
            @click="install"
            class="hidden sm:flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium border border-primary-300 rounded-md px-2 py-1 transition-colors"
            title="Instalar app"
          >
            <ArrowDownTrayIcon class="h-4 w-4" />
            <span>Instalar</span>
          </button>

          <!-- Idioma -->
          <LanguageSwitcher />

          <!-- Notificações -->
          <button
            v-if="isAuthenticated"
            type="button"
            class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
          >
            <span class="sr-only">{{ $t('nav.viewNotifications') }}</span>
            <BellIcon class="h-6 w-6" />
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-400 ring-2 ring-white"
            ></span>
          </button>

          <!-- Menu do Usuário -->
          <div v-if="isAuthenticated" class="relative">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span class="sr-only">{{ $t('nav.openUserMenu') }}</span>
                  <div
                    v-if="user?.avatar"
                    class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
                  >
                    <img :src="user.avatar" :alt="user.name" class="h-8 w-8 rounded-full object-cover" />
                  </div>
                  <div
                    v-else
                    class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium"
                  >
                    {{ userInitials }}
                  </div>
                  <span class="hidden sm:block text-gray-700 font-medium">{{ user?.name }}</span>
                  <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-for="item in userMenuItems" :key="item.href || item.label" v-slot="{ active }">
                      <router-link
                        v-if="item.href"
                        :to="item.href"
                        :class="[
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm'
                        ]"
                      >
                        <component :is="item.icon" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {{ item.label }}
                      </router-link>
                      <button
                        v-else
                        @click="item.action"
                        :class="[
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'group flex w-full items-center px-4 py-2 text-sm'
                        ]"
                      >
                        <component :is="item.icon" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {{ item.label }}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Botões de Login/Registro -->
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link
              to="/register"
              class="btn-primary"
            >
              {{ $t('nav.register') }}
            </router-link>
          </div>

          <!-- Menu Mobile -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span class="sr-only">{{ $t('nav.openMainMenu') }}</span>
              <Bars3Icon v-if="!mobileMenuOpen" class="block h-6 w-6" />
              <XMarkIcon v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div v-show="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
        <!-- Busca Mobile -->
        <div class="px-3 py-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('nav.searchPlaceholder')"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <!-- Navegação Mobile -->
        <router-link
          v-for="item in navigation"
          :key="item.href"
          :to="item.href"
          class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === item.href }"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  HeartIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useInstallPrompt } from '@/composables/useInstallPrompt'
import { useNetworkStatus } from '@/composables/useNetworkStatus'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { isInstallable, install } = useInstallPrompt()
const { isOnline } = useNetworkStatus()

// State
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const unreadNotifications = ref(0) // TODO: Implementar notificações

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

// Navigation items
const navigation = computed(() => [
  { label: t('nav.home'), href: '/' },
  { label: t('nav.donations'), href: '/donations' },
  { label: t('nav.categories'), href: '/categories' },
  { label: t('nav.howItWorks'), href: '/how-it-works' },
])

// User menu items
const userMenuItems = computed(() => [
  { label: t('nav.myProfile'), href: '/profile', icon: UserIcon },
  { label: t('nav.myDonations'), href: '/my-donations', icon: HeartIcon },
  { label: t('nav.chats'), href: '/chats', icon: ChatBubbleLeftRightIcon },
  { label: t('nav.createDonation'), href: '/donations/create', icon: PlusIcon },
  { label: t('nav.settings'), href: '/settings', icon: Cog6ToothIcon },
  { label: t('nav.logout'), action: handleLogout, icon: ArrowRightOnRectangleIcon },
])

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/donations',
      query: { search: searchQuery.value.trim() }
    })
    mobileMenuOpen.value = false
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>

