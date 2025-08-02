<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="pb-16 md:pb-0">
      <router-view />
    </main>
    
    <!-- Footer (apenas desktop) -->
    <AppFooter class="hidden md:block" />
    
    <!-- Mobile Navigation -->
    <MobileNavigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileNavigation from '@/components/layout/MobileNavigation.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize auth state on app mount
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<style>
/* Garantir que o conteúdo não seja coberto pela navegação mobile */
@media (max-width: 768px) {
  main {
    min-height: calc(100vh - 4rem - 4rem); /* altura da tela - header - mobile nav */
  }
}

/* Smooth transitions para mudanças de rota */
.router-link-active {
  transition: all 0.2s ease-in-out;
}

/* Scrollbar personalizada para webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animações para elementos que aparecem */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading spinner */
.spinner {
  border: 2px solid #f3f4f6;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Focus styles para acessibilidade */
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Estilo para elementos disabled */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>

