# Conceito de Design para o Aplicativo Doe Me (Frontend Vue.js)

Este documento detalha o conceito de design para a aplicação web híbrida "Doe Me", com foco em uma interface intuitiva, moderna e responsiva, otimizada para futura compilação mobile.

## 🎨 Paleta de Cores

A paleta de cores será inspirada em tons que transmitem confiança, esperança e empatia, com um toque de modernidade e acessibilidade. Utilizaremos uma base neutra com cores vibrantes para elementos de destaque e ações.

- **Primária (Azul/Ciano):** `#0EA5E9` (Tailwind `primary-500`) - Para botões de ação, cabeçalhos, ícones principais. Transmite confiança e clareza.
- **Secundária (Roxo/Magenta):** `#D946EF` (Tailwind `secondary-500`) - Para elementos secundários, destaques, ou como cor complementar. Adiciona um toque de criatividade e modernidade.
- **Sucesso (Verde):** `#22C55E` (Tailwind `success-500`) - Para feedback positivo, confirmações.
- **Aviso (Amarelo):** `#F59E0B` (Tailwind `warning-500`) - Para alertas, informações importantes.
- **Perigo (Vermelho):** `#EF4444` (Tailwind `danger-500`) - Para erros, ações destrutivas.
- **Neutras (Cinzas):** `#F9FAFB` (Tailwind `gray-50`) - Fundo principal.
  `#E5E7EB` (Tailwind `gray-200`) - Bordas, divisores.
  `#6B7280` (Tailwind `gray-500`) - Texto secundário, ícones.
  `#1F2937` (Tailwind `gray-800`) - Texto principal, cabeçalhos.

## 🅰️ Tipografia

Utilizaremos uma fonte sans-serif moderna e legível, com boa hierarquia visual para garantir clareza e facilidade de leitura em diferentes tamanhos de tela.

- **Fonte Principal:** `Inter` (já configurada no `tailwind.config.js` e `main.css`).
- **Títulos (H1-H3):** `Inter` Bold/Semi-Bold, tamanhos maiores para impacto.
- **Corpo de Texto (P, Span):** `Inter` Regular/Medium, tamanhos padrão para legibilidade.

## 🖼️ Ícones

Serão utilizados ícones vetoriais para garantir escalabilidade e clareza em todas as resoluções. A biblioteca `Heroicons` (já instalada) será a principal fonte de ícones, complementada se necessário.

- **Estilo:** Ícones de linha (outline) para uma aparência leve e moderna.
- **Uso:** Navegação, ações, categorias, status.

## 📐 Layout e Estrutura

O layout será baseado em um design responsivo mobile-first, utilizando Tailwind CSS para flexibilidade e consistência.

- **Grid System:** Flexbox e Grid do Tailwind CSS para layouts adaptáveis.
- **Espaçamento:** Utilização de espaçamentos consistentes (baseados em múltiplos de 4px ou 8px) para criar ritmo visual.
- **Componentes Reutilizáveis:**
    - **Botões:** `btn`, `btn-primary`, `btn-secondary`, `btn-outline`, etc.
    - **Inputs:** `input`, `input-error`
    - **Cards:** `card`, `card-header`, `card-body`, `card-footer`
    - **Badges:** `badge`, `badge-primary`, `badge-success`, etc.
    - **Modais/Dialogs:** Para interações que exigem foco do usuário (Headless UI).
    - **Dropdowns:** Para menus e seleções (Headless UI).
    - **Navegação:** Componentes para barra de navegação superior e inferior (mobile).

## 📱 Responsividade e Acessibilidade

- **Mobile-First:** O desenvolvimento começará com o design para telas menores, expandindo para tablets e desktops.
- **Viewport Meta Tag:** Configuração adequada para garantir o dimensionamento correto em dispositivos móveis.
- **Áreas Seguras (Safe Area):** Utilização de `env(safe-area-inset-*)` para garantir que o conteúdo não seja cortado por entalhes ou barras de sistema em dispositivos iOS (já configurado no `main.css`).
- **Interações Touch-Friendly:** Botões e elementos interativos com áreas de toque maiores para facilitar o uso em telas sensíveis ao toque.
- **Modo Escuro:** Suporte básico para modo escuro via `@media (prefers-color-scheme: dark)` (já configurado no `main.css`).
- **Semântica HTML:** Uso de tags HTML semânticas para melhorar a acessibilidade e SEO.
- **Contraste de Cores:** Garantir contraste suficiente entre texto e fundo para legibilidade.

## 💡 Inspirações Visuais

As imagens de referência (1, 2, 4, 5, 6, 7) do Dribbble e Pinterest mostram interfaces limpas, com cartões bem definidos, uso de ilustrações suaves e uma navegação intuitiva. A ideia é capturar essa sensação de leveza e facilidade de uso, adaptando-a para o contexto de doações.

- **Cartões:** Utilização extensiva de cards para organizar informações sobre itens de doação, categorias, chats e avaliações.
- **Ilustrações:** Possível uso de ilustrações simples e amigáveis para telas de onboarding, estados vazios ou seções informativas.
- **Navegação Inferior (Mobile):** Uma barra de navegação inferior clara e acessível para as principais seções do aplicativo (Home, Doações, Chat, Perfil).

## ⚙️ Ferramentas e Bibliotecas

- **Vue.js 3:** Framework principal.
- **Pinia:** Gerenciamento de estado.
- **Vue Router:** Navegação.
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
- **Headless UI:** Componentes UI sem estilo para acessibilidade e flexibilidade.
- **Heroicons:** Biblioteca de ícones.
- **Axios:** Cliente HTTP para comunicação com a API.
- **Vue Toastification:** Notificações de feedback ao usuário.

Este conceito de design servirá como guia para o desenvolvimento das próximas fases, garantindo uma experiência de usuário coesa e agradável.

