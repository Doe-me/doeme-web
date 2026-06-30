import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// @ts-expect-error - Echo client espera Pusher disponível globalmente
window.Pusher = Pusher

let echoInstance: Echo<'reverb'> | null = null

/**
 * Cria (ou reaproveita) a conexão com o servidor Reverb, autenticando canais
 * privados com o mesmo Bearer token usado nas chamadas REST (src/services/api.ts).
 */
export const getEcho = (): Echo<'reverb'> => {
  if (echoInstance) {
    return echoInstance
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const authEndpoint = `${apiUrl.replace(/\/api\/?$/, '')}/broadcasting/auth`

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 80,
    wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        Accept: 'application/json',
      },
    },
  })

  return echoInstance
}

export const disconnectEcho = (): void => {
  echoInstance?.disconnect()
  echoInstance = null
}
