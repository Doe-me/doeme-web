<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <!-- Logo e Descrição -->
        <div class="space-y-8 xl:col-span-1">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <HeartIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold">Doe Me</span>
          </div>
          <p class="text-gray-300 text-base max-w-md">
            Conectando pessoas através da generosidade. Uma plataforma simples e segura para doações entre pessoas.
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
                Plataforma
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in platformLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Suporte
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in supportLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Empresa
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in companyLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Legal
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in legalLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
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
              Fique por dentro
            </h3>
            <p class="mt-4 text-base text-gray-300">
              Receba as últimas novidades e dicas sobre doações.
            </p>
          </div>
          <div class="mt-4 xl:mt-0 xl:col-span-2">
            <form class="sm:flex sm:max-w-md xl:max-w-lg">
              <label for="email-address" class="sr-only">Endereço de email</label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autocomplete="email"
                required
                class="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white focus:border-white focus:placeholder-gray-400"
                placeholder="Digite seu email"
                v-model="newsletterEmail"
              />
              <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  @click.prevent="subscribeNewsletter"
                  class="w-full bg-primary-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-colors duration-200"
                >
                  Inscrever-se
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
              :key="item.name"
              :to="item.href"
              class="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
            >
              {{ item.name }}
            </router-link>
          </div>
          <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {{ currentYear }} Doe Me. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State
const newsletterEmail = ref('')

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Links
const socialLinks = [
  // { name: 'Facebook', href: '#', icon: FacebookIcon },
  // { name: 'Instagram', href: '#', icon: InstagramIcon },
  // { name: 'Twitter', href: '#', icon: TwitterIcon },
]

const platformLinks = [
  { name: 'Como Funciona', href: '/how-it-works' },
  { name: 'Doações', href: '/donations' },
  { name: 'Categorias', href: '/categories' },
  { name: 'Comunidade', href: '/community' },
]

const supportLinks = [
  { name: 'Central de Ajuda', href: '/help' },
  { name: 'Contato', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Segurança', href: '/safety' },
]

const companyLinks = [
  { name: 'Sobre Nós', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Carreiras', href: '/careers' },
  { name: 'Imprensa', href: '/press' },
]

const legalLinks = [
  { name: 'Privacidade', href: '/privacy' },
  { name: 'Termos', href: '/terms' },
  { name: 'Cookies', href: '/cookies' },
]

const bottomLinks = [
  { name: 'Privacidade', href: '/privacy' },
  { name: 'Termos', href: '/terms' },
  { name: 'Acessibilidade', href: '/accessibility' },
]

// Methods
const subscribeNewsletter = () => {
  if (!newsletterEmail.value) {
    toast.error('Por favor, digite um email válido')
    return
  }

  // TODO: Implementar inscrição na newsletter
  toast.success('Obrigado! Você foi inscrito na nossa newsletter.')
  newsletterEmail.value = ''
}
</script>

