<template>
  <div class="container mx-auto p-4 max-w-6xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Como Funciona o Doe Me</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Conectar pessoas que querem doar com quem precisa nunca foi tão simples.
        Descubra como nossa plataforma funciona em apenas alguns passos.
      </p>
    </div>
    
    <!-- Processo Principal -->
    <div class="mb-16">
      <h2 class="text-3xl font-semibold text-center mb-8">Processo Simples em 3 Passos</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📝</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">1. Cadastre-se</h3>
          <p class="text-gray-600">
            Crie sua conta gratuitamente usando email ou redes sociais.
            É rápido e seguro!
          </p>
        </div>
        
        <div class="text-center">
          <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🎁</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">2. Doe ou Busque</h3>
          <p class="text-gray-600">
            Publique itens para doação ou encontre o que você precisa
            usando nossos filtros inteligentes.
          </p>
        </div>
        
        <div class="text-center">
          <div class="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🤝</span>
          </div>
          <h3 class="text-xl font-semibold mb-3">3. Conecte-se</h3>
          <p class="text-gray-600">
            Use nosso chat interno para combinar detalhes e
            finalizar a doação com segurança.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Para Doadores -->
    <div class="mb-16">
      <div class="bg-blue-50 rounded-lg p-8">
        <h2 class="text-3xl font-semibold mb-6 text-center">Para Doadores</h2>
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-xl font-semibold mb-4">Como doar seus itens:</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <span>Tire fotos claras do item que deseja doar</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <span>Preencha as informações: título, descrição, categoria e localização</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <span>Publique sua doação e aguarde interessados entrarem em contato</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <span>Combine detalhes pelo chat e entregue o item</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                <span>Avalie a experiência e ajude outros usuários</span>
              </li>
            </ul>
          </div>
          <div class="text-center">
            <div class="bg-white rounded-lg p-6 shadow-md">
              <h4 class="text-lg font-semibold mb-3">Benefícios para Doadores</h4>
              <ul class="text-left space-y-2">
                <li>✅ Ajude quem precisa</li>
                <li>✅ Libere espaço em casa</li>
                <li>✅ Contribua com o meio ambiente</li>
                <li>✅ Construa uma reputação positiva</li>
                <li>✅ Conecte-se com sua comunidade</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Para Receptores -->
    <div class="mb-16">
      <div class="bg-green-50 rounded-lg p-8">
        <h2 class="text-3xl font-semibold mb-6 text-center">Para Receptores</h2>
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="text-center">
            <div class="bg-white rounded-lg p-6 shadow-md">
              <h4 class="text-lg font-semibold mb-3">Benefícios para Receptores</h4>
              <ul class="text-left space-y-2">
                <li>✅ Encontre itens gratuitos</li>
                <li>✅ Economize dinheiro</li>
                <li>✅ Acesso a variedade de produtos</li>
                <li>✅ Comunicação segura</li>
                <li>✅ Avaliações confiáveis</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Como encontrar o que precisa:</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <span>Use a busca e filtros para encontrar itens específicos</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <span>Navegue por categorias ou busque por localização</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <span>Entre em contato com o doador através do chat</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <span>Combine horário e local para retirada</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                <span>Retire o item e avalie a experiência</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recursos da Plataforma -->
    <div class="mb-16">
      <h2 class="text-3xl font-semibold text-center mb-8">Recursos da Plataforma</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-3">💬</div>
          <h3 class="text-lg font-semibold mb-2">Chat Interno</h3>
          <p class="text-gray-600 text-sm">
            Comunicação segura entre doadores e interessados
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-3">📍</div>
          <h3 class="text-lg font-semibold mb-2">Geolocalização</h3>
          <p class="text-gray-600 text-sm">
            Encontre doações próximas à sua localização
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-3">⭐</div>
          <h3 class="text-lg font-semibold mb-2">Avaliações</h3>
          <p class="text-gray-600 text-sm">
            Sistema de feedback para construir confiança
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-3">📱</div>
          <h3 class="text-lg font-semibold mb-2">Mobile-First</h3>
          <p class="text-gray-600 text-sm">
            Acesse de qualquer dispositivo, a qualquer hora
          </p>
        </div>
      </div>
    </div>
    
    <!-- Segurança -->
    <div class="mb-16">
      <div class="bg-gray-50 rounded-lg p-8">
        <h2 class="text-3xl font-semibold text-center mb-6">Segurança e Confiança</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl mb-3">🔒</div>
            <h3 class="text-lg font-semibold mb-2">Dados Protegidos</h3>
            <p class="text-gray-600">
              Suas informações pessoais são criptografadas e protegidas
            </p>
          </div>
          
          <div class="text-center">
            <div class="text-3xl mb-3">✅</div>
            <h3 class="text-lg font-semibold mb-2">Usuários Verificados</h3>
            <p class="text-gray-600">
              Sistema de verificação para maior segurança
            </p>
          </div>
          
          <div class="text-center">
            <div class="text-3xl mb-3">🛡️</div>
            <h3 class="text-lg font-semibold mb-2">Moderação Ativa</h3>
            <p class="text-gray-600">
              Equipe dedicada para manter a plataforma segura
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Call to Action -->
    <div class="text-center bg-blue-600 text-white rounded-lg p-8">
      <h2 class="text-3xl font-semibold mb-4">Pronto para Começar?</h2>
      <p class="text-xl mb-6">
        Junte-se à nossa comunidade e faça a diferença hoje mesmo!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/register"
          class="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
        >
          Criar Conta Gratuita
        </router-link>
        <router-link
          to="/donations"
          class="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors"
        >
          Ver Doações
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica específica da página Como Funciona, se houver
</script>

