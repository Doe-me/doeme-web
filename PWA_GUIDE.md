# Guia PWA - Doe Me App

Este guia detalha como a aplicação Doe Me está configurada como Progressive Web App (PWA) e como otimizar a experiência offline.

## 🌟 O que é PWA?

Progressive Web Apps são aplicações web que oferecem experiência similar a aplicativos nativos, incluindo:

- **Instalação** na tela inicial
- **Funcionamento offline** com Service Workers
- **Notificações push** nativas
- **Acesso a APIs** do dispositivo
- **Performance** otimizada

## 🚀 Configuração Atual

### 1. Web App Manifest

O arquivo `public/manifest.json` define como a aplicação aparece quando instalada:

```json
{
  "name": "Doe Me - Plataforma de Doações",
  "short_name": "Doe Me",
  "description": "Conecte doadores e beneficiários de forma simples e segura",
  "theme_color": "#3B82F6",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "lang": "pt-BR",
  "categories": ["social", "lifestyle", "utilities"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Tela inicial do Doe Me"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Tela inicial mobile"
    }
  ],
  "shortcuts": [
    {
      "name": "Nova Doação",
      "short_name": "Doar",
      "description": "Criar uma nova doação",
      "url": "/donations/create",
      "icons": [
        {
          "src": "/icons/shortcut-donate.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Mensagens",
      "short_name": "Chat",
      "description": "Ver conversas",
      "url": "/chat",
      "icons": [
        {
          "src": "/icons/shortcut-chat.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

### 2. Service Worker

O Service Worker está configurado no `public/sw.js` para:

- **Cache de recursos** estáticos
- **Cache de API** responses
- **Funcionamento offline**
- **Atualizações automáticas**

```javascript
const CACHE_NAME = 'doe-me-v1.0.0'
const STATIC_CACHE = 'doe-me-static-v1.0.0'
const API_CACHE = 'doe-me-api-v1.0.0'

// Recursos para cache inicial
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Adicionar outros recursos críticos
]

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First - para recursos estáticos
  static: 'cache-first',
  // Network First - para dados dinâmicos
  api: 'network-first',
  // Stale While Revalidate - para imagens
  images: 'stale-while-revalidate'
}
```

### 3. Meta Tags PWA

No `index.html`:

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#3B82F6">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Doe Me">
<meta name="msapplication-TileColor" content="#3B82F6">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#3B82F6">
```

## 🔧 Configuração do Vite PWA

### 1. Plugin Vite PWA

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.doeme\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=${Date.now()}`
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Doe Me - Plataforma de Doações',
        short_name: 'Doe Me',
        description: 'Conecte doadores e beneficiários de forma simples e segura',
        theme_color: '#3B82F6',
        background_color: '#FFFFFF',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

### 2. Registro do Service Worker

```typescript
// src/main.ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Mostrar notificação de atualização disponível
    showUpdateNotification()
  },
  onOfflineReady() {
    // App pronto para funcionar offline
    showOfflineNotification()
  },
  onRegistered(r) {
    console.log('SW Registered: ' + r)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  }
})

const showUpdateNotification = () => {
  // Implementar notificação de atualização
  if (confirm('Nova versão disponível! Atualizar agora?')) {
    updateSW(true)
  }
}
```

## 📱 Funcionalidades PWA

### 1. Instalação

```typescript
// src/composables/useInstallPrompt.ts
import { ref } from 'vue'

export const useInstallPrompt = () => {
  const deferredPrompt = ref<any>(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  // Detectar se já está instalado
  const checkIfInstalled = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }
  }

  // Capturar evento de instalação
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  })

  // Mostrar prompt de instalação
  const showInstallPrompt = async () => {
    if (!deferredPrompt.value) return

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalada')
    }
    
    deferredPrompt.value = null
    isInstallable.value = false
  }

  checkIfInstalled()

  return {
    isInstallable,
    isInstalled,
    showInstallPrompt
  }
}
```

### 2. Status de Conexão

```typescript
// src/composables/useNetworkStatus.ts
import { ref, onMounted, onUnmounted } from 'vue'

export const useNetworkStatus = () => {
  const isOnline = ref(navigator.onLine)

  const updateNetworkStatus = () => {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateNetworkStatus)
    window.removeEventListener('offline', updateNetworkStatus)
  })

  return { isOnline }
}
```

### 3. Cache de Dados

```typescript
// src/utils/cache.ts
export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>

  constructor() {
    this.cache = new Map()
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any, ttl: number = 300000): void { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear(): void {
    this.cache.clear()
  }
}
```

### 4. Sincronização em Background

```typescript
// src/utils/backgroundSync.ts
export class BackgroundSync {
  private static queue: Array<{ url: string; data: any; method: string }> = []

  static addToQueue(url: string, data: any, method: string = 'POST'): void {
    this.queue.push({ url, data, method })
    this.processQueue()
  }

  static async processQueue(): Promise<void> {
    if (!navigator.onLine) return

    while (this.queue.length > 0) {
      const item = this.queue.shift()
      if (!item) continue

      try {
        await fetch(item.url, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(item.data)
        })
      } catch (error) {
        // Recolocar na fila se falhar
        this.queue.unshift(item)
        break
      }
    }
  }

  static init(): void {
    window.addEventListener('online', () => {
      this.processQueue()
    })
  }
}
```

## 🔔 Push Notifications

### 1. Configuração

```typescript
// src/utils/notifications.ts
export class NotificationManager {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  static async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (Notification.permission !== 'granted') {
      return
    }

    const registration = await navigator.serviceWorker.ready
    
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options
    })
  }

  static async subscribeToPush(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.ready
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
    })

    // Enviar subscription para o servidor
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(subscription)
    })

    return subscription
  }
}
```

### 2. Service Worker para Push

```javascript
// public/sw.js
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    body: data.body || 'Nova mensagem no Doe Me',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Doe Me', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    )
  }
})
```

## 📊 Analytics PWA

### 1. Métricas de Instalação

```typescript
// src/utils/pwaAnalytics.ts
export class PWAAnalytics {
  static trackInstallPrompt(): void {
    // Enviar evento para analytics
    gtag('event', 'pwa_install_prompt_shown', {
      event_category: 'PWA',
      event_label: 'Install Prompt'
    })
  }

  static trackInstallAccepted(): void {
    gtag('event', 'pwa_installed', {
      event_category: 'PWA',
      event_label: 'Install Accepted'
    })
  }

  static trackOfflineUsage(): void {
    gtag('event', 'pwa_offline_usage', {
      event_category: 'PWA',
      event_label: 'Offline Mode'
    })
  }

  static trackUpdateAvailable(): void {
    gtag('event', 'pwa_update_available', {
      event_category: 'PWA',
      event_label: 'Update Prompt'
    })
  }
}
```

### 2. Performance Monitoring

```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  static measurePWAMetrics(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime)
          gtag('event', 'timing_complete', {
            name: 'FCP',
            value: Math.round(entry.startTime)
          })
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
      gtag('event', 'timing_complete', {
        name: 'LCP',
        value: Math.round(lastEntry.startTime)
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  }
}
```

## 🧪 Testes PWA

### 1. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### 2. PWA Testing

```typescript
// tests/pwa.test.ts
import { test, expect } from '@playwright/test'

test.describe('PWA Features', () => {
  test('should have manifest', async ({ page }) => {
    await page.goto('/')
    
    const manifest = await page.locator('link[rel="manifest"]')
    expect(manifest).toBeVisible()
    
    const manifestUrl = await manifest.getAttribute('href')
    const response = await page.request.get(manifestUrl!)
    expect(response.status()).toBe(200)
  })

  test('should register service worker', async ({ page }) => {
    await page.goto('/')
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    
    expect(swRegistered).toBe(true)
  })

  test('should work offline', async ({ page, context }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Simular offline
    await context.setOffline(true)
    
    await page.reload()
    
    // Verificar se a página ainda carrega
    const title = await page.title()
    expect(title).toContain('Doe Me')
  })
})
```

## 🚀 Deploy PWA

### 1. Configuração do Servidor

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name doeme.com;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # PWA headers
    location / {
        root /var/www/doe-me;
        try_files $uri $uri/ /index.html;
        
        # Cache headers
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Manifest and SW
        location = /manifest.json {
            add_header Cache-Control "public, max-age=0";
        }
        
        location = /sw.js {
            add_header Cache-Control "public, max-age=0";
        }
    }
}
```

### 2. HTTPS Obrigatório

PWAs requerem HTTPS. Configure certificados SSL:

```bash
# Usando Certbot (Let's Encrypt)
sudo certbot --nginx -d doeme.com
```

## 📈 Otimizações

### 1. Preload de Recursos Críticos

```html
<!-- Preload recursos críticos -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/api/categories" as="fetch" crossorigin>
```

### 2. Resource Hints

```html
<!-- DNS prefetch para APIs externas -->
<link rel="dns-prefetch" href="//api.doeme.com">
<link rel="dns-prefetch" href="//cdn.doeme.com">

<!-- Preconnect para recursos críticos -->
<link rel="preconnect" href="//fonts.googleapis.com">
<link rel="preconnect" href="//fonts.gstatic.com" crossorigin>
```

### 3. Code Splitting

```typescript
// Lazy loading de rotas
const routes = [
  {
    path: '/donations',
    component: () => import('../views/donations/DonationsView.vue')
  },
  {
    path: '/chat',
    component: () => import('../views/chat/ChatsView.vue')
  }
]
```

---

Este guia fornece uma base completa para otimizar a experiência PWA da aplicação Doe Me. Para mais informações, consulte a [documentação oficial do PWA](https://web.dev/progressive-web-apps/).

