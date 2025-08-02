# Guia de Build Mobile - Doe Me App

Este guia detalha como converter a aplicação web Doe Me em um aplicativo móvel nativo usando Capacitor ou Cordova.

## 📱 Visão Geral

A aplicação Doe Me foi projetada como uma aplicação web híbrida, permitindo fácil conversão para aplicativos móveis nativos. Oferecemos duas opções principais:

1. **Capacitor** (Recomendado) - Solução moderna da Ionic
2. **Cordova** - Solução tradicional e estável

## 🚀 Opção 1: Capacitor (Recomendado)

### Por que Capacitor?
- Performance superior
- Melhor integração com ferramentas modernas
- APIs nativas mais simples
- Suporte ativo da comunidade
- Compatível com Vue.js 3

### Pré-requisitos

#### Para Android:
- Android Studio 4.0+
- Android SDK 21+
- Java 8+
- Gradle 6.0+

#### Para iOS:
- Xcode 12+
- iOS 11+
- macOS (obrigatório para build iOS)
- Apple Developer Account (para distribuição)

### Instalação e Configuração

#### 1. Instalar Capacitor

```bash
# Instalar dependências do Capacitor
npm install @capacitor/core @capacitor/cli

# Instalar plugins das plataformas
npm install @capacitor/android @capacitor/ios

# Plugins adicionais recomendados
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/push-notifications @capacitor/geolocation @capacitor/camera @capacitor/filesystem
```

#### 2. Inicializar Capacitor

```bash
# Inicializar configuração
npx cap init "Doe Me" "com.doeme.app"
```

#### 3. Configurar capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.doeme.app',
  appName: 'Doe Me',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#3B82F6"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

#### 4. Build da Aplicação Web

```bash
# Build otimizado para produção
npm run build

# Verificar se o build foi criado corretamente
ls -la dist/
```

#### 5. Adicionar Plataformas

```bash
# Adicionar Android
npx cap add android

# Adicionar iOS (apenas no macOS)
npx cap add ios
```

#### 6. Sincronizar Arquivos

```bash
# Sincronizar web assets com as plataformas nativas
npx cap sync

# Ou sincronizar apenas uma plataforma
npx cap sync android
npx cap sync ios
```

### Build Android

#### 1. Abrir no Android Studio

```bash
npx cap open android
```

#### 2. Configurar Signing (Para Release)

No Android Studio:
1. Vá em `Build > Generate Signed Bundle / APK`
2. Escolha `APK` ou `Android App Bundle`
3. Crie ou selecione um keystore
4. Configure as informações de assinatura

#### 3. Build via Linha de Comando

```bash
# Debug build
cd android
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Voltar para o diretório raiz
cd ..
```

#### 4. Localizar APK

```bash
# Debug APK
android/app/build/outputs/apk/debug/app-debug.apk

# Release APK
android/app/build/outputs/apk/release/app-release.apk
```

### Build iOS

#### 1. Abrir no Xcode

```bash
npx cap open ios
```

#### 2. Configurar Signing & Capabilities

No Xcode:
1. Selecione o projeto no navigator
2. Vá na aba `Signing & Capabilities`
3. Configure seu Team e Bundle Identifier
4. Adicione capabilities necessárias (Push Notifications, etc.)

#### 3. Build para Dispositivo

1. Conecte um dispositivo iOS ou selecione um simulador
2. Clique em `Product > Build` (⌘+B)
3. Para executar: `Product > Run` (⌘+R)

#### 4. Archive para App Store

1. `Product > Archive`
2. No Organizer, clique em `Distribute App`
3. Siga o processo de upload para App Store Connect

### Plugins Nativos Essenciais

#### 1. Geolocalização

```bash
npm install @capacitor/geolocation
```

```typescript
import { Geolocation } from '@capacitor/geolocation';

const getCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  return coordinates;
};
```

#### 2. Câmera

```bash
npm install @capacitor/camera
```

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  return image;
};
```

#### 3. Push Notifications

```bash
npm install @capacitor/push-notifications
```

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

const initPushNotifications = async () => {
  await PushNotifications.requestPermissions();
  await PushNotifications.register();
};
```

#### 4. Haptics (Vibração)

```bash
npm install @capacitor/haptics
```

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const vibrate = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};
```

### Configurações Específicas para Mobile

#### 1. Atualizar main.ts

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configurações específicas para mobile
if (Capacitor.isNativePlatform()) {
  // Configurar status bar
  StatusBar.setStyle({ style: Style.Dark })
  
  // Esconder splash screen após carregamento
  SplashScreen.hide()
}

app.mount('#app')
```

#### 2. Detectar Plataforma

```typescript
import { Capacitor } from '@capacitor/core'

export const isMobile = Capacitor.isNativePlatform()
export const isAndroid = Capacitor.getPlatform() === 'android'
export const isIOS = Capacitor.getPlatform() === 'ios'
export const isWeb = Capacitor.getPlatform() === 'web'
```

#### 3. Configurar Roteamento para Mobile

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { Capacitor } from '@capacitor/core'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // suas rotas
  ]
})

// Configurações específicas para mobile
if (Capacitor.isNativePlatform()) {
  // Prevenir navegação para trás no Android
  router.beforeEach((to, from, next) => {
    if (to.path === '/') {
      // Lógica específica para home
    }
    next()
  })
}
```

## 🔧 Opção 2: Cordova

### Instalação

```bash
# Instalar Cordova globalmente
npm install -g cordova

# Criar projeto Cordova
cordova create mobile-app com.doeme.app "Doe Me"
cd mobile-app

# Adicionar plataformas
cordova platform add android
cordova platform add ios
```

### Configuração

#### 1. Copiar Build

```bash
# Build da aplicação Vue
cd ../
npm run build

# Copiar para Cordova
cp -r dist/* mobile-app/www/
cd mobile-app
```

#### 2. Configurar config.xml

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.doeme.app" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>Doe Me</name>
    <description>Aplicativo de doações</description>
    <author email="dev@doeme.com" href="https://doeme.com">
        Doe Me Team
    </author>
    
    <content src="index.html" />
    
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    
    <platform name="android">
        <allow-intent href="market:*" />
        <icon density="ldpi" src="res/icon/android/ldpi.png" />
        <icon density="mdpi" src="res/icon/android/mdpi.png" />
        <icon density="hdpi" src="res/icon/android/hdpi.png" />
        <icon density="xhdpi" src="res/icon/android/xhdpi.png" />
        <icon density="xxhdpi" src="res/icon/android/xxhdpi.png" />
        <icon density="xxxhdpi" src="res/icon/android/xxxhdpi.png" />
    </platform>
    
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>
</widget>
```

#### 3. Build

```bash
# Build para Android
cordova build android

# Build para iOS
cordova build ios

# Build para produção
cordova build android --release
cordova build ios --release
```

## 📱 Otimizações para Mobile

### 1. Performance

```typescript
// Lazy loading de componentes
const LazyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))

// Preload de rotas críticas
router.beforeEach((to, from, next) => {
  if (to.meta.preload) {
    // Precarregar dados
  }
  next()
})
```

### 2. Touch e Gestos

```vue
<template>
  <div 
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    class="touch-area"
  >
    <!-- Conteúdo -->
  </div>
</template>

<script setup lang="ts">
const handleTouchStart = (e: TouchEvent) => {
  // Lógica de touch start
}

const handleTouchMove = (e: TouchEvent) => {
  // Lógica de touch move
}

const handleTouchEnd = (e: TouchEvent) => {
  // Lógica de touch end
}
</script>
```

### 3. Viewport e Safe Areas

```css
/* Suporte a safe areas do iOS */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Viewport responsivo */
@media screen and (max-width: 768px) {
  .mobile-only {
    display: block;
  }
  
  .desktop-only {
    display: none;
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Build Falha no Android

```bash
# Limpar cache
npx cap sync android
cd android
./gradlew clean
cd ..

# Verificar versões
npx cap doctor
```

#### 2. iOS não Abre

```bash
# Verificar configurações
npx cap open ios

# No Xcode, verificar:
# - Bundle Identifier
# - Signing Certificate
# - Deployment Target
```

#### 3. Plugins não Funcionam

```bash
# Reinstalar plugins
npm uninstall @capacitor/camera
npm install @capacitor/camera
npx cap sync
```

### Logs e Debug

#### Android

```bash
# Logs do dispositivo
adb logcat

# Logs específicos da app
adb logcat | grep "DoeMeApp"
```

#### iOS

```bash
# Usar Xcode Console
# Window > Devices and Simulators
# Selecionar dispositivo > View Device Logs
```

## 📦 Distribuição

### Google Play Store

1. **Preparar Release**
   - Assinar APK/AAB
   - Testar em dispositivos reais
   - Preparar assets (ícones, screenshots)

2. **Upload**
   - Criar conta Google Play Developer
   - Criar nova aplicação
   - Upload do AAB/APK
   - Preencher informações da store

### Apple App Store

1. **Preparar Release**
   - Archive no Xcode
   - Testar no TestFlight
   - Preparar assets e metadata

2. **Upload**
   - App Store Connect
   - Upload via Xcode Organizer
   - Submeter para review

## 🔄 Atualizações

### Capacitor Live Updates

```bash
# Instalar plugin de live updates
npm install @capacitor/live-updates

# Configurar no capacitor.config.ts
{
  plugins: {
    LiveUpdates: {
      appId: 'your-app-id',
      channel: 'production',
      autoUpdateMethod: 'background'
    }
  }
}
```

### Over-the-Air Updates

```typescript
import { LiveUpdates } from '@capacitor/live-updates'

const checkForUpdates = async () => {
  const result = await LiveUpdates.sync()
  if (result.activeApplicationPathChanged) {
    // App foi atualizado, reiniciar
    window.location.reload()
  }
}
```

## 📊 Analytics e Monitoramento

### Firebase Analytics

```bash
npm install @capacitor-firebase/analytics
```

```typescript
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'

const logEvent = async (eventName: string, parameters: any) => {
  await FirebaseAnalytics.logEvent({
    name: eventName,
    parameters
  })
}
```

### Crashlytics

```bash
npm install @capacitor-firebase/crashlytics
```

```typescript
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics'

const logError = async (error: Error) => {
  await FirebaseCrashlytics.recordException({
    message: error.message,
    stacktrace: error.stack
  })
}
```

---

Este guia fornece uma base sólida para converter a aplicação Doe Me em um aplicativo móvel nativo. Para dúvidas específicas, consulte a documentação oficial do [Capacitor](https://capacitorjs.com) ou [Cordova](https://cordova.apache.org).

