import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Início' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Entrar', guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Cadastrar', guest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { title: 'Recuperar senha', guest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { title: 'Redefinir senha', guest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/auth/ProfileView.vue'),
      meta: { title: 'Meu Perfil', requiresAuth: true }
    },
    {
      path: '/donations',
      name: 'donations',
      component: () => import('@/views/donations/DonationsView.vue'),
      meta: { title: 'Doações' }
    },
    {
      path: '/donations/create',
      name: 'donations-create',
      component: () => import('@/views/donations/CreateDonationView.vue'),
      meta: { title: 'Criar Doação', requiresAuth: true }
    },
    {
      path: '/donations/:id',
      name: 'donation-details',
      component: () => import('@/views/donations/DonationDetailsView.vue'),
      meta: { title: 'Detalhes da Doação' },
      props: true
    },
    {
      path: '/donations/:id/edit',
      name: 'donation-edit',
      component: () => import('@/views/donations/EditDonationView.vue'),
      meta: { title: 'Editar Doação', requiresAuth: true },
      props: true
    },
    {
      path: '/my-donations',
      name: 'my-donations',
      component: () => import('@/views/donations/MyDonationsView.vue'),
      meta: { title: 'Minhas Doações', requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/categories/CategoriesView.vue'),
      meta: { title: 'Categorias' }
    },
    {
      path: '/categories/:id',
      name: 'category-details',
      component: () => import('@/views/categories/CategoryDetailsView.vue'),
      meta: { title: 'Categoria' },
      props: true
    },
    {
      path: '/chats',
      name: 'chats',
      component: () => import('@/views/chat/ChatsView.vue'),
      meta: { title: 'Conversas', requiresAuth: true }
    },
    {
      path: '/chats/:id',
      name: 'chat-details',
      component: () => import('@/views/chat/ChatView.vue'),
      meta: { title: 'Conversa', requiresAuth: true },
      props: true
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('@/views/reviews/ReviewsView.vue'),
      meta: { title: 'Avaliações' }
    },
    {
      path: '/users/:id/reviews',
      name: 'user-reviews',
      component: () => import('@/views/reviews/UserReviewsView.vue'),
      meta: { title: 'Avaliações do Usuário' },
      props: true
    },
    {
      path: '/how-it-works',
      name: 'how-it-works',
      component: () => import('@/views/HowItWorksView.vue'),
      meta: { title: 'Como Funciona' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Sobre Nós' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { title: 'Contato' }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/HelpView.vue'),
      meta: { title: 'Ajuda' }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: { title: 'Política de Privacidade' }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
      meta: { title: 'Termos de Uso' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Configurações', requiresAuth: true }
    },
    // OAuth callback routes
    {
      path: '/auth/google/callback',
      name: 'google-callback',
      component: () => import('@/views/auth/SocialCallbackView.vue'),
      meta: { title: 'Autenticando...', provider: 'google' }
    },
    {
      path: '/auth/facebook/callback',
      name: 'facebook-callback',
      component: () => import('@/views/auth/SocialCallbackView.vue'),
      meta: { title: 'Autenticando...', provider: 'facebook' }
    },
    // 404 Page
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página não encontrada' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Se há uma posição salva (ex: botão voltar), use ela
    if (savedPosition) {
      return savedPosition
    }
    // Se há um hash na URL, role para o elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Caso contrário, role para o topo
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_NAME || 'Doe Me'}`
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // Check if route is for guests only (login/register)
  if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect authenticated users away from guest pages
    next({ name: 'home' })
    return
  }

  next()
})

// Global error handler for navigation
router.onError((error) => {
  console.error('Router error:', error)
})

export default router

