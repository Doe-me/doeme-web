<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-bold text-primary-600">404</h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Página não encontrada
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <div class="mt-8 space-y-4">
        <router-link
          to="/"
          class="btn-primary w-full"
        >
          Voltar ao Início
        </router-link>
        <button
          @click="$router.go(-1)"
          class="btn-outline w-full"
        >
          Voltar à Página Anterior
        </button>
      </div>
    </div>
  </div>
</template>

