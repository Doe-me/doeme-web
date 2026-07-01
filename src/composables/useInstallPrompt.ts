import { ref, onMounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  onMounted(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })
  })

  async function install() {
    if (!deferredPrompt.value) return

    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      isInstallable.value = false
    }
    deferredPrompt.value = null
  }

  return { isInstallable, isInstalled, install }
}
