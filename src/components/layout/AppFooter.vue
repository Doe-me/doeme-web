<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <!-- Logo e Descrição -->
        <div class="space-y-8 xl:col-span-1">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <HeartIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold">{{ $t('common.appName') }}</span>
          </div>
          <p class="text-gray-300 text-base max-w-md">
            {{ $t('footer.description') }}
          </p>
          <div class="flex space-x-6">
            <a
              v-for="item in socialLinks"
              :key="item.name"
              :href="item.href"
              class="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              <span class="sr-only">{{ item.name }}</span>
              <component :is="item.icon" class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {{ $t('footer.platform') }}
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in platformLinks" :key="item.href">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {{ $t('footer.support') }}
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in supportLinks" :key="item.href">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {{ $t('footer.company') }}
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in companyLinks" :key="item.href">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {{ $t('footer.legal') }}
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in legalLinks" :key="item.href">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="mt-12 border-t border-gray-700 pt-8">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
          <div class="xl:col-span-1">
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              {{ $t('footer.newsletterTitle') }}
            </h3>
            <p class="mt-4 text-base text-gray-300">
              {{ $t('footer.newsletterDescription') }}
            </p>
          </div>
          <div class="mt-4 xl:mt-0 xl:col-span-2">
            <form class="sm:flex sm:max-w-md xl:max-w-lg">
              <label for="email-address" class="sr-only">{{ $t('footer.emailAddress') }}</label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autocomplete="email"
                required
                class="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white focus:border-white focus:placeholder-gray-400"
                :placeholder="$t('footer.emailPlaceholder')"
                v-model="newsletterEmail"
              />
              <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  @click.prevent="subscribeNewsletter"
                  class="w-full bg-primary-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-colors duration-200"
                >
                  {{ $t('footer.subscribe') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 border-t border-gray-700 pt-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex space-x-6 md:order-2">
            <router-link
              v-for="item in bottomLinks"
              :key="item.href"
              :to="item.href"
              class="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
            >
              {{ item.label }}
            </router-link>
          </div>
          <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            {{ $t('footer.copyright', { year: currentYear }) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { t } = useI18n()

// State
const newsletterEmail = ref('')

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Links
const socialLinks: { name: string; href: string; icon: unknown }[] = [
  // { name: 'Facebook', href: '#', icon: FacebookIcon },
  // { name: 'Instagram', href: '#', icon: InstagramIcon },
  // { name: 'Twitter', href: '#', icon: TwitterIcon },
]

const platformLinks = computed(() => [
  { label: t('footer.howItWorks'), href: '/how-it-works' },
  { label: t('footer.donations'), href: '/donations' },
  { label: t('footer.categories'), href: '/categories' },
  { label: t('footer.community'), href: '/community' },
])

const supportLinks = computed(() => [
  { label: t('footer.helpCenter'), href: '/help' },
  { label: t('footer.contact'), href: '/contact' },
  { label: t('footer.faq'), href: '/faq' },
  { label: t('footer.safety'), href: '/safety' },
])

const companyLinks = computed(() => [
  { label: t('footer.about'), href: '/about' },
  { label: t('footer.blog'), href: '/blog' },
  { label: t('footer.careers'), href: '/careers' },
  { label: t('footer.press'), href: '/press' },
])

const legalLinks = computed(() => [
  { label: t('footer.privacy'), href: '/privacy' },
  { label: t('footer.terms'), href: '/terms' },
  { label: t('footer.cookies'), href: '/cookies' },
])

const bottomLinks = computed(() => [
  { label: t('footer.privacy'), href: '/privacy' },
  { label: t('footer.terms'), href: '/terms' },
  { label: t('footer.accessibility'), href: '/accessibility' },
])

// Methods
const subscribeNewsletter = () => {
  if (!newsletterEmail.value) {
    toast.error(t('footer.subscribeError'))
    return
  }

  // TODO: Implementar inscrição na newsletter
  toast.success(t('footer.subscribeSuccess'))
  newsletterEmail.value = ''
}
</script>

