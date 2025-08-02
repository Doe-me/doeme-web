# Docker Configuration - Doe Me Frontend

Este documento descreve a configuração Docker para a aplicação frontend Vue.js do projeto Doe Me.

## 📋 Visão Geral

A configuração Docker inclui:
- **Multi-stage build** para otimização de imagem
- **Ambiente de desenvolvimento** com hot reload
- **Ambiente de produção** com Nginx otimizado
- **Docker Compose** para orquestração
- **Health checks** para monitoramento
- **Segurança** com usuário não-root

## 🏗️ Arquitetura

### Dockerfile Multi-stage

1. **Builder Stage**: Compila a aplicação Vue.js
2. **Production Stage**: Serve arquivos estáticos com Nginx
3. **Development Stage**: Ambiente de desenvolvimento com hot reload

### Estrutura de Arquivos

```
docker/
├── nginx.conf              # Configuração principal do Nginx
├── default.conf            # Configuração do servidor
├── nginx-proxy.conf        # Proxy reverso para desenvolvimento
├── nginx-lb.conf          # Load balancer para produção
└── docker-entrypoint.sh   # Script de inicialização

docker-compose.yml          # Configuração principal
docker-compose.dev.yml     # Ambiente de desenvolvimento
docker-compose.prod.yml    # Ambiente de produção
.dockerignore              # Arquivos ignorados no build
.env.docker               # Variáveis de ambiente
Makefile                  # Comandos facilitadores
```

## 🚀 Como Usar

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
make dev

# Ou usando docker-compose diretamente
docker-compose -f docker-compose.dev.yml up --build

# Em background
make dev-detached

# Ver logs
make dev-logs

# Parar
make dev-stop
```

### Produção

```bash
# Iniciar ambiente de produção
make prod

# Ou usando docker-compose diretamente
docker-compose -f docker-compose.prod.yml up --build

# Em background
make prod-detached

# Ver logs
make prod-logs

# Parar
make prod-stop
```

### Comandos Úteis

```bash
# Ver todos os comandos disponíveis
make help

# Build das imagens
make build-dev
make build-prod

# Acessar shell do container
make shell-dev
make shell-prod

# Executar testes
make test

# Verificar saúde dos containers
make health

# Limpar containers e imagens
make clean
```

## 🔧 Configuração

### Variáveis de Ambiente

Edite o arquivo `.env.docker` para configurar:

```env
# API Configuration
API_URL=http://localhost:8000/api
VITE_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=Doe Me
VITE_APP_DESCRIPTION=Plataforma de doações entre pessoas

# Development Configuration
NODE_ENV=development
VITE_HMR_HOST=localhost
VITE_HMR_PORT=3000
```

### Portas

- **Desenvolvimento**: `3000` (mapeada para `5173` interno)
- **Produção**: `80`
- **Proxy Nginx**: `8080`

## 🔒 Segurança

### Medidas Implementadas

1. **Usuário não-root**: Containers executam com usuário `nextjs`
2. **Security headers**: Configurados no Nginx
3. **Rate limiting**: Implementado para produção
4. **Health checks**: Monitoramento automático
5. **Minimal base images**: Alpine Linux para menor superfície de ataque

### Headers de Segurança

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' http: https: data: blob: 'unsafe-inline'
```

## 📊 Monitoramento

### Health Checks

- **Desenvolvimento**: `http://localhost:3000/`
- **Produção**: `http://localhost/health`

### Logs

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs específicos do frontend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Status dos Containers

```bash
# Ver status
make status

# Verificar saúde
make health
```

## 🚀 Deploy

### Desenvolvimento Local

1. Clone o repositório
2. Configure as variáveis em `.env.docker`
3. Execute `make dev`
4. Acesse `http://localhost:3000`

### Produção

1. Configure as variáveis de produção
2. Execute `make prod`
3. Acesse `http://localhost`

### CI/CD

Exemplo de pipeline GitLab CI:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build --target production -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - docker-compose -f docker-compose.prod.yml up -d
  only:
    - main
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**:
   ```bash
   # Verificar processos usando a porta
   lsof -i :3000
   
   # Parar containers
   make dev-stop
   ```

2. **Problemas de permissão**:
   ```bash
   # Limpar volumes
   make clean-volumes
   
   # Rebuild
   make build-dev
   ```

3. **Hot reload não funciona**:
   - Verifique se `VITE_HMR_HOST` está configurado
   - Certifique-se de que a porta WebSocket está acessível

4. **API não conecta**:
   - Verifique `VITE_API_URL` no `.env.docker`
   - Certifique-se de que a API Laravel está rodando

### Debug

```bash
# Acessar shell do container
make shell-dev

# Ver logs detalhados
docker-compose -f docker-compose.dev.yml logs -f --tail=100

# Inspecionar container
docker inspect doe-me-frontend-dev
```

## 📝 Notas

- O volume `node_modules` é persistido para melhor performance
- Hot reload funciona através de WebSocket
- Nginx serve arquivos estáticos com cache otimizado
- CORS está configurado para desenvolvimento local
- Gzip está habilitado para melhor performance

## 🔄 Atualizações

Para atualizar a configuração Docker:

1. Modifique os arquivos necessários
2. Rebuild as imagens: `make build-all`
3. Reinicie os containers: `make dev-restart`

## 📞 Suporte

Para problemas relacionados ao Docker:
1. Verifique os logs: `make dev-logs`
2. Consulte a documentação oficial do Docker
3. Verifique issues conhecidos no repositório

