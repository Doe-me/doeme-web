import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
import i18n from './locales'

import './assets/main.css'

registerSW({
  onNeedRefresh() {
    const toast = useToast()
    toast.info('Nova versão disponível! Recarregue para atualizar.', {
      timeout: false,
      closeOnClick: false,
      onClick: () => window.location.reload(),
    })
  },
  onOfflineReady() {
    const toast = useToast()
    toast.success('App pronto para uso offline.')
  },
})

const app = createApp(App)

// Pinia store
app.use(createPinia())

// Vue Router
app.use(router)

// i18n (pt-BR padrão, en-US, es-ES)
app.use(i18n)

// Toast notifications
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
})

app.mount('#app')

