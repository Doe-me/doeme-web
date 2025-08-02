# Docker Troubleshooting - Doe Me Frontend

## 🚨 Problemas Conhecidos

### 1. Erro de iptables no Sandbox

**Problema**: 
```
Unable to enable DIRECT ACCESS FILTERING - DROP rule: (iptables failed: iptables --wait -t raw -A PREROUTING -d 172.17.0.2 ! -i docker0 -j DROP: iptables v1.8.7 (legacy): can't initialize iptables table `raw': Table does not exist
```

**Causa**: O ambiente sandbox pode ter limitações de kernel que impedem o Docker de configurar regras de iptables.

**Soluções**:

#### Opção 1: Usar network mode bridge simples
```bash
# Use o docker-compose simplificado
sudo docker compose -f docker-compose.simple.yml up --build
```

#### Opção 2: Executar sem rede customizada
```bash
# Build da imagem
sudo docker build --target development -t doe-me-frontend:dev . --network=host

# Executar container
sudo docker run --rm -p 3000:5173 -v $(pwd):/app -v node_modules:/app/node_modules doe-me-frontend:dev
```

#### Opção 3: Usar host network
```bash
# Executar com network host
sudo docker run --rm --network host -v $(pwd):/app doe-me-frontend:dev
```

### 2. Problemas de Permissão

**Problema**: Arquivos criados pelo Docker pertencem ao root

**Solução**:
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .

# Ou usar user mapping no docker-compose
user: "${UID:-1000}:${GID:-1000}"
```

### 3. Volume node_modules não funciona

**Problema**: Dependências não são instaladas corretamente

**Solução**:
```bash
# Remover volume e recriar
sudo docker volume rm doe-me-app_node_modules
sudo docker compose -f docker-compose.simple.yml up --build
```

### 4. Hot Reload não funciona

**Problema**: Mudanças no código não são refletidas automaticamente

**Soluções**:
```bash
# 1. Verificar se o volume está montado corretamente
sudo docker compose -f docker-compose.simple.yml exec frontend ls -la /app

# 2. Usar polling para file watching
# Adicionar ao package.json:
"dev": "vite --host 0.0.0.0 --poll"

# 3. Verificar variáveis de ambiente
VITE_HMR_HOST=localhost
VITE_HMR_PORT=3000
```

## 🔧 Comandos de Diagnóstico

### Verificar Status do Docker
```bash
sudo systemctl status docker
sudo docker info
sudo docker version
```

### Verificar Rede
```bash
sudo docker network ls
sudo docker network inspect bridge
```

### Verificar Containers
```bash
sudo docker ps -a
sudo docker logs doe-me-frontend-dev
```

### Verificar Volumes
```bash
sudo docker volume ls
sudo docker volume inspect doe-me-app_node_modules
```

## 🚀 Alternativas de Desenvolvimento

### 1. Desenvolvimento Local (Recomendado para Sandbox)
```bash
# Instalar dependências localmente
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar em http://localhost:5173
```

### 2. Docker com Network Host
```bash
# Build da imagem
sudo docker build --target development -t doe-me-frontend:dev .

# Executar com network host
sudo docker run --rm --network host \
  -v $(pwd):/app \
  -v node_modules:/app/node_modules \
  -e NODE_ENV=development \
  -e VITE_API_URL=http://localhost:8000/api \
  doe-me-frontend:dev
```

### 3. Docker Compose Simplificado
```bash
# Usar configuração simplificada
sudo docker compose -f docker-compose.simple.yml up --build
```

## 📝 Configurações Alternativas

### Dockerfile Simplificado
Se os problemas persistirem, use esta versão simplificada:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Docker Compose Mínimo
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 🔍 Debug Avançado

### Acessar Container
```bash
# Executar shell no container
sudo docker compose -f docker-compose.simple.yml exec frontend sh

# Ou executar container interativo
sudo docker run --rm -it --entrypoint sh doe-me-frontend:dev
```

### Verificar Logs Detalhados
```bash
# Logs do Docker daemon
sudo journalctl -u docker.service

# Logs do container
sudo docker logs -f doe-me-frontend-dev
```

### Verificar Recursos
```bash
# Uso de recursos
sudo docker stats

# Informações do sistema
sudo docker system df
sudo docker system events
```

## 💡 Dicas de Performance

### 1. Usar .dockerignore
Certifique-se de que o `.dockerignore` está configurado corretamente para evitar copiar arquivos desnecessários.

### 2. Multi-stage Build
Use multi-stage builds para reduzir o tamanho da imagem final.

### 3. Cache de Layers
Organize o Dockerfile para maximizar o cache de layers:
```dockerfile
# Copiar package.json primeiro
COPY package*.json ./
RUN npm install

# Copiar código depois
COPY . .
```

## 🆘 Quando Tudo Falha

Se nenhuma solução funcionar no ambiente sandbox:

1. **Use desenvolvimento local**: `npm run dev`
2. **Documente a configuração**: Os arquivos Docker estão prontos para uso em ambiente de produção
3. **Teste em ambiente real**: A configuração funcionará em servidores com kernel completo

## 📞 Suporte

Para problemas específicos do ambiente sandbox:
- Verifique limitações do kernel
- Use alternativas sem rede customizada
- Considere desenvolvimento local como fallback

