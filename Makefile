# Makefile para gerenciar containers Docker da aplicação Doe Me

# Variáveis
COMPOSE_FILE_DEV = docker-compose.dev.yml
COMPOSE_FILE_PROD = docker-compose.prod.yml
COMPOSE_FILE_MAIN = docker-compose.yml
COMPOSE_FILE_SIMPLE = docker-compose.simple.yml

# Comandos de desenvolvimento
.PHONY: dev
dev: ## Iniciar ambiente de desenvolvimento
	sudo docker compose -f $(COMPOSE_FILE_DEV) up --build

.PHONY: dev-simple
dev-simple: ## Iniciar ambiente de desenvolvimento simplificado (para sandbox)
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) up --build

.PHONY: dev-detached
dev-detached: ## Iniciar ambiente de desenvolvimento em background
	sudo docker compose -f $(COMPOSE_FILE_DEV) up --build -d

.PHONY: dev-logs
dev-logs: ## Ver logs do ambiente de desenvolvimento
	sudo docker compose -f $(COMPOSE_FILE_DEV) logs -f

.PHONY: dev-stop
dev-stop: ## Parar ambiente de desenvolvimento
	sudo docker compose -f $(COMPOSE_FILE_DEV) down

.PHONY: dev-restart
dev-restart: ## Reiniciar ambiente de desenvolvimento
	sudo docker compose -f $(COMPOSE_FILE_DEV) restart

# Comandos alternativos para sandbox
.PHONY: dev-local
dev-local: ## Executar desenvolvimento local (sem Docker)
	npm install && npm run dev

.PHONY: dev-host
dev-host: ## Executar com network host (alternativa para sandbox)
	sudo docker build --target development -t doe-me-frontend:dev . && \
	sudo docker run --rm --network host \
		-v $(PWD):/app \
		-v node_modules:/app/node_modules \
		-e NODE_ENV=development \
		-e VITE_API_URL=http://localhost:8000/api \
		doe-me-frontend:dev

# Comandos de produção
.PHONY: prod
prod: ## Iniciar ambiente de produção
	sudo docker compose -f $(COMPOSE_FILE_PROD) up --build

.PHONY: prod-detached
prod-detached: ## Iniciar ambiente de produção em background
	sudo docker compose -f $(COMPOSE_FILE_PROD) up --build -d

.PHONY: prod-logs
prod-logs: ## Ver logs do ambiente de produção
	sudo docker compose -f $(COMPOSE_FILE_PROD) logs -f

.PHONY: prod-stop
prod-stop: ## Parar ambiente de produção
	sudo docker compose -f $(COMPOSE_FILE_PROD) down

# Comandos de build
.PHONY: build-dev
build-dev: ## Build da imagem de desenvolvimento
	sudo docker build --target development -t doe-me-frontend:dev .

.PHONY: build-prod
build-prod: ## Build da imagem de produção
	sudo docker build --target production -t doe-me-frontend:prod .

.PHONY: build-all
build-all: ## Build de todas as imagens
	sudo docker build --target development -t doe-me-frontend:dev .
	sudo docker build --target production -t doe-me-frontend:prod .

# Comandos de limpeza
.PHONY: clean
clean: ## Limpar containers e imagens não utilizadas
	sudo docker compose -f $(COMPOSE_FILE_DEV) down --rmi all --volumes --remove-orphans || true
	sudo docker compose -f $(COMPOSE_FILE_PROD) down --rmi all --volumes --remove-orphans || true
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) down --rmi all --volumes --remove-orphans || true
	sudo docker system prune -f

.PHONY: clean-volumes
clean-volumes: ## Limpar volumes
	sudo docker compose -f $(COMPOSE_FILE_DEV) down --volumes || true
	sudo docker compose -f $(COMPOSE_FILE_PROD) down --volumes || true
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) down --volumes || true

# Comandos de shell
.PHONY: shell-dev
shell-dev: ## Acessar shell do container de desenvolvimento
	sudo docker compose -f $(COMPOSE_FILE_DEV) exec frontend sh

.PHONY: shell-simple
shell-simple: ## Acessar shell do container simplificado
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend sh

.PHONY: shell-prod
shell-prod: ## Acessar shell do container de produção
	sudo docker compose -f $(COMPOSE_FILE_PROD) exec frontend sh

# Comandos de teste
.PHONY: test
test: ## Executar testes
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend npm test || npm test

.PHONY: lint
lint: ## Executar linter
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend npm run lint || npm run lint

.PHONY: format
format: ## Formatar código
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend npm run format || npm run format

# Comandos de instalação
.PHONY: install
install: ## Instalar dependências
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend npm install || npm install

.PHONY: install-package
install-package: ## Instalar um pacote específico (uso: make install-package PACKAGE=nome-do-pacote)
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend npm install $(PACKAGE) || npm install $(PACKAGE)

# Comandos de monitoramento
.PHONY: status
status: ## Ver status dos containers
	sudo docker compose -f $(COMPOSE_FILE_DEV) ps || true
	sudo docker compose -f $(COMPOSE_FILE_PROD) ps || true
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) ps || true

.PHONY: health
health: ## Verificar saúde dos containers
	sudo docker compose -f $(COMPOSE_FILE_SIMPLE) exec frontend wget --no-verbose --tries=1 --spider http://localhost:5173/ || echo "Container unhealthy"

# Comandos de backup
.PHONY: backup
backup: ## Criar backup do código
	tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz --exclude=node_modules --exclude=dist --exclude=.git .

# Comandos de troubleshooting
.PHONY: doctor
doctor: ## Diagnosticar problemas do Docker
	@echo "=== Docker Status ==="
	sudo systemctl status docker --no-pager || true
	@echo "\n=== Docker Version ==="
	sudo docker version || true
	@echo "\n=== Docker Info ==="
	sudo docker info || true
	@echo "\n=== Docker Networks ==="
	sudo docker network ls || true
	@echo "\n=== Docker Volumes ==="
	sudo docker volume ls || true
	@echo "\n=== Running Containers ==="
	sudo docker ps || true

.PHONY: fix-permissions
fix-permissions: ## Corrigir permissões de arquivos
	sudo chown -R $$USER:$$USER .

# Help
.PHONY: help
help: ## Mostrar esta ajuda
	@echo "Comandos disponíveis:"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  dev-simple     - Usar para ambientes sandbox (recomendado)"
	@echo "  dev-local      - Desenvolvimento local sem Docker"
	@echo "  dev-host       - Docker com network host"
	@echo ""
	@echo "🔧 Troubleshooting:"
	@echo "  doctor         - Diagnosticar problemas"
	@echo "  fix-permissions - Corrigir permissões"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

