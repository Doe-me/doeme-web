<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Central de Ajuda</h1>
    
    <!-- Busca -->
    <div class="mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por ajuda..."
          class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Perguntas Frequentes -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
      <div class="space-y-4">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="bg-white rounded-lg shadow-md"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
          >
            <span class="font-medium">{{ faq.question }}</span>
            <svg
              :class="{ 'rotate-180': openFaqs.includes(index) }"
              class="h-5 w-5 text-gray-500 transform transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div
            v-show="openFaqs.includes(index)"
            class="px-6 pb-4 text-gray-600"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Categorias de Ajuda -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Categorias de Ajuda</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in helpCategories"
          :key="category.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="selectCategory(category)"
        >
          <div class="text-3xl mb-3">{{ category.icon }}</div>
          <h3 class="text-lg font-semibold mb-2">{{ category.title }}</h3>
          <p class="text-gray-600 text-sm">{{ category.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Guias Rápidos -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Guias Rápidos</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="guide in quickGuides"
          :key="guide.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="text-lg font-semibold mb-3">{{ guide.title }}</h3>
          <ol class="space-y-2">
            <li
              v-for="(step, stepIndex) in guide.steps"
              :key="stepIndex"
              class="flex items-start"
            >
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">
                {{ stepIndex + 1 }}
              </span>
              <span class="text-gray-700">{{ step }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
    
    <!-- Contato para Suporte -->
    <div class="bg-blue-50 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-3">Ainda precisa de ajuda?</h2>
      <p class="text-gray-600 mb-4">
        Não encontrou o que procurava? Nossa equipe de suporte está pronta para ajudar!
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <router-link
          to="/contact"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-center"
        >
          Entrar em Contato
        </router-link>
        <a
          href="mailto:suporte@doeme.com"
          class="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 text-center"
        >
          Enviar E-mail
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const openFaqs = ref<number[]>([])

const faqs = ref([
  {
    question: 'Como faço para criar uma doação?',
    answer: 'Para criar uma doação, faça login na sua conta, clique em "Nova Doação" no menu principal, preencha as informações do item, adicione fotos e publique. É simples e rápido!'
  },
  {
    question: 'É seguro usar a plataforma?',
    answer: 'Sim! Temos várias medidas de segurança, incluindo verificação de usuários, sistema de avaliações e chat interno para comunicação segura entre doadores e interessados.'
  },
  {
    question: 'Como posso encontrar doações próximas a mim?',
    answer: 'Use os filtros de localização na página de doações. Você pode buscar por cidade, bairro ou usar sua localização atual para encontrar itens próximos.'
  },
  {
    question: 'Posso cancelar uma doação?',
    answer: 'Sim, você pode cancelar uma doação a qualquer momento antes dela ser finalizada. Vá até "Minhas Doações" e clique em "Cancelar" no item desejado.'
  },
  {
    question: 'Como funciona o sistema de avaliações?',
    answer: 'Após uma doação ser concluída, tanto o doador quanto o receptor podem avaliar um ao outro de 1 a 5 estrelas e deixar comentários sobre a experiência.'
  },
  {
    question: 'Posso editar uma doação já publicada?',
    answer: 'Sim, você pode editar informações da doação enquanto ela estiver ativa. Vá até "Minhas Doações" e clique em "Editar" no item desejado.'
  }
])

const helpCategories = ref([
  {
    id: 1,
    icon: '🎁',
    title: 'Criar Doações',
    description: 'Aprenda como publicar seus itens para doação'
  },
  {
    id: 2,
    icon: '🔍',
    title: 'Buscar Itens',
    description: 'Encontre o que você precisa usando nossos filtros'
  },
  {
    id: 3,
    icon: '💬',
    title: 'Chat e Comunicação',
    description: 'Como usar o sistema de mensagens'
  },
  {
    id: 4,
    icon: '⭐',
    title: 'Avaliações',
    description: 'Sistema de feedback entre usuários'
  },
  {
    id: 5,
    icon: '👤',
    title: 'Perfil e Conta',
    description: 'Gerenciar suas informações pessoais'
  },
  {
    id: 6,
    icon: '🔒',
    title: 'Segurança',
    description: 'Dicas de segurança e privacidade'
  }
])

const quickGuides = ref([
  {
    id: 1,
    title: 'Como fazer sua primeira doação',
    steps: [
      'Faça login na sua conta',
      'Clique em "Nova Doação"',
      'Preencha as informações do item',
      'Adicione fotos de qualidade',
      'Defina a localização',
      'Publique sua doação'
    ]
  },
  {
    id: 2,
    title: 'Como encontrar itens para receber',
    steps: [
      'Acesse a página "Doações"',
      'Use os filtros de categoria e localização',
      'Navegue pelos itens disponíveis',
      'Clique no item de interesse',
      'Entre em contato com o doador',
      'Combine a retirada'
    ]
  }
])

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value
  
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const selectCategory = (category: unknown) => {
  // Implementar navegação para categoria específica
  console.log('Categoria selecionada:', category)
}
</script>

