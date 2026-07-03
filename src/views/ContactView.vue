<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950">
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Entre em Contato</h1>

    <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Fale Conosco</h2>
      <p class="text-gray-600 dark:text-neutral-400 mb-6">
        Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para ajudar!
        Preencha o formulário abaixo e entraremos em contato o mais breve possível.
      </p>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Nome</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
            placeholder="Seu nome completo"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Assunto</label>
          <select
            id="subject"
            v-model="form.subject"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          >
            <option value="">Selecione um assunto</option>
            <option value="duvida">Dúvida</option>
            <option value="sugestao">Sugestão</option>
            <option value="problema">Problema técnico</option>
            <option value="parceria">Parceria</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Mensagem</label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="5"
            class="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
            placeholder="Descreva sua mensagem aqui..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
        </button>
      </form>
    </div>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-3 dark:text-white">Informações de Contato</h3>
        <div class="space-y-2">
          <p class="flex items-center">
            <span class="font-medium mr-2">E-mail:</span>
            <a href="mailto:contato@doeme.com" class="text-blue-600 hover:underline">
              contato@doeme.com
            </a>
          </p>
          <p class="flex items-center">
            <span class="font-medium mr-2">Telefone:</span>
            <a href="tel:+5511999999999" class="text-blue-600 hover:underline">
              (11) 99999-9999
            </a>
          </p>
          <p class="flex items-center dark:text-neutral-300">
            <span class="font-medium mr-2">Horário:</span>
            <span>Segunda a Sexta, 9h às 18h</span>
          </p>
        </div>
      </div>
      
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-3 dark:text-white">Redes Sociais</h3>
        <div class="space-y-2">
          <a href="#" class="flex items-center text-blue-600 hover:underline">
            <span class="mr-2">📘</span>
            Facebook
          </a>
          <a href="#" class="flex items-center text-blue-600 hover:underline">
            <span class="mr-2">📷</span>
            Instagram
          </a>
          <a href="#" class="flex items-center text-blue-600 hover:underline">
            <span class="mr-2">🐦</span>
            Twitter
          </a>
          <a href="#" class="flex items-center text-blue-600 hover:underline">
            <span class="mr-2">💼</span>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    
    // Limpar formulário
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch {
    toast.error('Erro ao enviar mensagem. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

