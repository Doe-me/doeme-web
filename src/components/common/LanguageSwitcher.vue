<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="flex items-center space-x-1 p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <span class="sr-only">{{ $t('nav.openMainMenu') }}</span>
      <LanguageIcon class="h-5 w-5" />
      <span class="hidden sm:block text-sm font-medium">{{ currentLocaleLabel }}</span>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-black dark:ring-neutral-700 ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-for="loc in SUPPORTED_LOCALES" :key="loc" v-slot="{ active }">
            <button
              type="button"
              @click="changeLocale(loc)"
              :class="[
                active ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-neutral-300',
                loc === locale ? 'font-semibold' : '',
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              {{ LOCALE_LABELS[loc] }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { LanguageIcon } from '@heroicons/vue/24/outline'
import { SUPPORTED_LOCALES, LOCALE_LABELS, setStoredLocale, type SupportedLocale } from '@/locales'

const { locale } = useI18n()

const currentLocaleLabel = computed(() => LOCALE_LABELS[locale.value as SupportedLocale])

const changeLocale = (newLocale: SupportedLocale) => {
  locale.value = newLocale
  setStoredLocale(newLocale)
}
</script>
