# Guia de Deploy - Doe Me App

Este guia detalha como fazer deploy da aplicação Doe Me em diferentes ambientes de produção.

## 🌐 Opções de Deploy

1. **Vercel** (Recomendado para frontend)
2. **Netlify** (Alternativa popular)
3. **AWS S3 + CloudFront** (Escalável)
4. **Docker + VPS** (Controle total)
5. **GitHub Pages** (Gratuito para projetos open source)

## 🚀 Deploy na Vercel (Recomendado)

### Por que Vercel?
- Deploy automático via Git
- CDN global
- HTTPS automático
- Suporte nativo a Vue.js
- Preview deployments
- Analytics integrado

### Configuração

#### 1. Preparar o Projeto

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login
```

#### 2. Configurar vercel.json

```json
{
  "version": 2,
  "name": "doe-me-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_APP_NAME": "@vite_app_name"
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### 3. Deploy

```bash
# Deploy inicial
vercel

# Deploy para produção
vercel --prod
```

#### 4. Configurar Domínio Customizado

```bash
# Adicionar domínio
vercel domains add doeme.com

# Configurar DNS
# A record: @ -> 76.76.19.61
# CNAME record: www -> cname.vercel-dns.com
```

### Variáveis de Ambiente

No painel da Vercel, configure:

```
VITE_API_URL=https://api.doeme.com/api
VITE_APP_NAME=Doe Me
VITE_APP_URL=https://doeme.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

## 🌟 Deploy na Netlify

### Configuração

#### 1. netlify.toml

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 2. Deploy via Git

1. Conecte repositório no painel Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configure variáveis de ambiente
4. Deploy automático a cada push

#### 3. Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

## ☁️ Deploy na AWS

### S3 + CloudFront

#### 1. Configurar S3 Bucket

```bash
# Criar bucket
aws s3 mb s3://doe-me-app

# Configurar website hosting
aws s3 website s3://doe-me-app --index-document index.html --error-document index.html

# Upload dos arquivos
aws s3 sync dist/ s3://doe-me-app --delete
```

#### 2. Configurar CloudFront

```json
{
  "CallerReference": "doe-me-app-2024",
  "Comment": "Doe Me App Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-doe-me-app",
        "DomainName": "doe-me-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-doe-me-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  },
  "Enabled": true
}
```

#### 3. Script de Deploy

```bash
#!/bin/bash
# deploy-aws.sh

# Build da aplicação
npm run build

# Upload para S3
aws s3 sync dist/ s3://doe-me-app --delete

# Invalidar cache do CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"

echo "Deploy concluído!"
```

## 🐳 Deploy com Docker

### Dockerfile para Produção

```dockerfile
# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage

# Copiar arquivos buildados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # No cache for service worker and manifest
        location = /sw.js {
            add_header Cache-Control "public, max-age=0, must-revalidate";
        }
        
        location = /manifest.json {
            add_header Cache-Control "public, max-age=0, must-revalidate";
        }
        
        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Docker Compose para Produção

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Opcional: Nginx como proxy reverso
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Deploy Script

```bash
#!/bin/bash
# deploy-docker.sh

# Build da imagem
docker build -t doe-me-app:latest .

# Parar containers existentes
docker-compose down

# Iniciar novos containers
docker-compose up -d

# Limpar imagens antigas
docker image prune -f

echo "Deploy Docker concluído!"
```

## 🔧 VPS/Servidor Dedicado

### Configuração do Servidor

#### 1. Instalar Dependências

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm git

# CentOS/RHEL
sudo yum update
sudo yum install -y nginx certbot python3-certbot-nginx nodejs npm git
```

#### 2. Configurar Nginx

```nginx
# /etc/nginx/sites-available/doe-me
server {
    listen 80;
    server_name doeme.com www.doeme.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name doeme.com www.doeme.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/doeme.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/doeme.com/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    root /var/www/doe-me;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # No cache for SW and manifest
    location = /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
    
    location = /manifest.json {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. Configurar SSL

```bash
# Obter certificado SSL
sudo certbot --nginx -d doeme.com -d www.doeme.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 4. Script de Deploy

```bash
#!/bin/bash
# deploy-vps.sh

# Variáveis
REPO_URL="https://github.com/user/doe-me-app.git"
DEPLOY_DIR="/var/www/doe-me"
BACKUP_DIR="/var/backups/doe-me"

# Backup da versão atual
if [ -d "$DEPLOY_DIR" ]; then
    sudo cp -r $DEPLOY_DIR $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)
fi

# Clone/pull do repositório
if [ -d "$DEPLOY_DIR" ]; then
    cd $DEPLOY_DIR
    sudo git pull origin main
else
    sudo git clone $REPO_URL $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

# Instalar dependências e build
sudo npm ci
sudo npm run build

# Copiar arquivos buildados
sudo cp -r dist/* $DEPLOY_DIR/

# Reiniciar nginx
sudo systemctl reload nginx

echo "Deploy concluído!"
```

## 🔄 CI/CD com GitHub Actions

### Deploy Automático

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Build application
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### Deploy Multi-ambiente

```yaml
# .github/workflows/deploy-multi.yml
name: Multi-environment Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
      - name: Deploy to Staging
        run: |
          # Deploy para ambiente de staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
      - name: Deploy to Production
        run: |
          # Deploy para produção
```

## 📊 Monitoramento

### Health Check

```typescript
// src/utils/healthCheck.ts
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health')
    return response.ok
  } catch (error) {
    return false
  }
}

// Verificação periódica
setInterval(async () => {
  const isHealthy = await healthCheck()
  if (!isHealthy) {
    console.error('Application health check failed')
    // Enviar alerta
  }
}, 60000) // A cada minuto
```

### Error Tracking

```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
})
```

### Analytics

```typescript
// src/utils/analytics.ts
import { gtag } from 'ga-gtag'

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href
})

// Track page views
router.afterEach((to) => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: to.path,
    page_title: to.meta.title || 'Doe Me'
  })
})
```

## 🔐 Segurança

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.doeme.com;
">
```

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.doeme.com/api
VITE_APP_NAME=Doe Me
VITE_APP_URL=https://doeme.com
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_MEASUREMENT_ID=your-ga-id
```

## 📈 Performance

### Bundle Analysis

```bash
# Analisar bundle
npm run build
npx vite-bundle-analyzer dist

# Ou usando webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist
```

### Lighthouse CI

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['https://doeme.com'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        'categories:pwa': ['error', {minScore: 0.9}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

---

Este guia fornece uma base completa para deploy da aplicação Doe Me em diferentes ambientes. Escolha a opção que melhor se adequa às suas necessidades e orçamento.

