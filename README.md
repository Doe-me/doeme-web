# Doe Me - Aplicação Web Híbrida

[![doe-me-logo.png](https://i.postimg.cc/6QQb85mQ/doe-me-logo.png)](https://postimg.cc/4YrQMZZC)

Uma aplicação web moderna e responsiva para doações, construída com Vue.js 3, TypeScript e Tailwind CSS. Projetada para ser uma PWA (Progressive Web App) e facilmente convertível para aplicativo móvel.

## 🌟 Características Principais

- **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS
- **PWA Ready**: Configurada como Progressive Web App
- **Mobile-First**: Otimizada para dispositivos móveis
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Arquitetura Robusta**: Pinia para gerenciamento de estado
- **Integração Completa**: API Laravel com autenticação JWT
- **Real-time**: Sistema de chat e notificações
- **Geolocalização**: Busca por proximidade

## 🚀 Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework progressivo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento SPA
- **Tailwind CSS** - Framework CSS utilitário
- **HeadlessUI** - Componentes acessíveis
- **Heroicons** - Ícones SVG
- **Axios** - Cliente HTTP
- **Vue Toastification** - Notificações

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **Lint-staged** - Linting em arquivos staged

## 📱 Funcionalidades

### 🔐 Autenticação
- Login/Registro tradicional
- Autenticação social (Google, Facebook)
- Recuperação de senha
- Perfil do usuário

### 🎁 Sistema de Doações
- Criação e edição de itens
- Upload de múltiplas imagens
- Categorização e filtros
- Busca por localização
- Status de doação (disponível, reservado, doado)

### 💬 Sistema de Chat
- Mensagens em tempo real
- Histórico de conversas
- Indicadores de status online
- Notificações de mensagens

### ⭐ Sistema de Avaliações
- Avaliações entre usuários
- Sistema de estrelas (1-5)
- Comentários e feedback
- Estatísticas de avaliações

### 📍 Geolocalização
- Busca por proximidade
- Mapa interativo
- Filtros por distância

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd doe-me-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Doe Me
VITE_APP_URL=http://localhost:5173
```

4. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Build da aplicação
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

### Desenvolvimento
```bash
# Usando docker-compose para desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Ou usando o Makefile
make dev
```

### Produção
```bash
# Build e execução em produção
docker-compose -f docker-compose.prod.yml up -d

# Ou usando o Makefile
make prod
```

## 📱 PWA (Progressive Web App)

A aplicação está configurada como PWA com:

- **Service Worker** para cache offline
- **Web App Manifest** para instalação
- **Ícones** para diferentes dispositivos
- **Splash Screens** personalizadas

### Instalação como App

1. Acesse a aplicação no navegador
2. Clique no ícone de "Instalar" na barra de endereços
3. Confirme a instalação
4. O app será adicionado à tela inicial

## 📱 Build para Mobile

### Capacitor (Recomendado)

1. **Instale o Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

2. **Configure o Capacitor**
```bash
npx cap init
```

3. **Build da aplicação**
```bash
npm run build
```

4. **Adicione as plataformas**
```bash
npx cap add android
npx cap add ios
```

5. **Sincronize os arquivos**
```bash
npx cap sync
```

6. **Abra no IDE nativo**
```bash
# Android Studio
npx cap open android

# Xcode
npx cap open ios
```

### Cordova (Alternativo)

1. **Instale o Cordova**
```bash
npm install -g cordova
```

2. **Crie o projeto Cordova**
```bash
cordova create mobile-app com.example.doeme "Doe Me"
cd mobile-app
```

3. **Adicione as plataformas**
```bash
cordova platform add android
cordova platform add ios
```

4. **Copie os arquivos do build**
```bash
cp -r ../dist/* www/
```

5. **Build para as plataformas**
```bash
cordova build android
cordova build ios
```

## 🔧 Configuração da API

A aplicação se conecta com a API Laravel. Configure as seguintes variáveis:

```env
# URL base da API
VITE_API_URL=http://localhost:8000/api

# Configurações de autenticação social
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

### Endpoints Principais

- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /donation-items` - Listar doações
- `POST /donation-items` - Criar doação
- `GET /chats` - Listar conversas
- `POST /chats/{id}/messages` - Enviar mensagem
- `GET /reviews` - Listar avaliações

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:coverage

# Executar testes E2E
npm run test:e2e
```

## 📊 Monitoramento e Analytics

### Performance
- Lighthouse CI configurado
- Web Vitals monitorados
- Bundle analyzer disponível

### Analytics
- Google Analytics integrado
- Eventos customizados
- Métricas de conversão

## 🔒 Segurança

### Medidas Implementadas
- Sanitização de inputs
- Validação client-side e server-side
- Headers de segurança
- HTTPS obrigatório em produção
- Rate limiting
- CORS configurado

### Boas Práticas
- Tokens JWT com expiração
- Refresh tokens
- Logout em múltiplas abas
- Validação de permissões

## 🌐 Internacionalização

A aplicação suporta múltiplos idiomas:

```bash
# Adicionar novo idioma
npm run i18n:add <locale>

# Extrair strings para tradução
npm run i18n:extract
```

Idiomas suportados:
- Português (pt-BR) - Padrão
- Inglês (en-US)
- Espanhol (es-ES)

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de rotas
- Code splitting automático
- Compressão de imagens
- Cache de assets
- Service Worker para cache offline
- Bundle optimization

### Métricas Alvo
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs e componentes

## 📝 Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para detalhes das versões.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvedor Frontend** - Implementação Vue.js
- **Desenvolvedor Backend** - API Laravel
- **Designer UI/UX** - Interface e experiência
- **DevOps** - Deploy e infraestrutura

## 📞 Suporte

- **Email**: suporte@doeme.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/doeme)
- **Documentação**: [docs.doeme.com](https://docs.doeme.com)

## 🔗 Links Úteis

- [API Documentation](https://api.doeme.com/docs)
- [Design System](https://design.doeme.com)
- [Status Page](https://status.doeme.com)
- [Blog](https://blog.doeme.com)

---

Feito com ❤️ pela equipe Doe Me

