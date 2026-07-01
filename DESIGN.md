---
name: Doe Me
description: Plataforma comunitária de doações — conectando vizinhos através da generosidade local
colors:
  primary: "#0284c7"
  primary-light: "#0ea5e9"
  accent: "#facc15"
  accent-deep: "#d97706"
  neutral-bg: "#f9fafb"
  neutral-surface: "#ffffff"
  neutral-ink: "#111827"
  neutral-muted: "#6b7280"
  neutral-border: "#e5e7eb"
  semantic-success: "#22c55e"
  semantic-warning: "#f59e0b"
  semantic-danger: "#ef4444"
  secondary: "#d946ef"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, ui-serif, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "#075985"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-accent-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "0"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  badge-available:
    backgroundColor: "#dcfce7"
    textColor: "#166534"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-reserved:
    backgroundColor: "#fef3c7"
    textColor: "#92400e"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-donated:
    backgroundColor: "#f3f4f6"
    textColor: "#374151"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: Doe Me

## 1. Overview

**Creative North Star: "The Generous Corner"**

O Doe Me é a praça de bairro digital — aquele lugar onde alguém coloca uma caixa de livros na calçada com um bilhete "pega quem quiser", e outro alguém passa, sorri, e leva. O design deve carregar essa leveza. Não é transação; é gesto. Não é marketplace; é vizinhança.

O sistema visual é funcional sem ser frio. Usa cor com clareza, não com decoração. O amarelo-dourado do `accent` é a cor do gesto generoso — o único ponto de calor cromático que importa. O azul do `primary` é o azul de trabalho: links, foco, estados interativos. Tudo o mais é neutro, dando espaço para as pessoas e os itens respirarem.

Este sistema recusa explicitamente: gradientes azul→roxo sobre heróis, cards idênticos com ícone + título + parágrafo repetidos em grid, métricas grandes com label abaixo como showoff de crescimento, e paleta fúcsia sem propósito estratégico. Qualquer tela que pareça uma landing page de SaaS de 2023 falhou no propósito do Doe Me.

**Key Characteristics:**
- Amarelo como calor, azul como função — esses dois papéis não se trocam
- Fundo neutro-limpo: deixa as fotos de itens e pessoas falarem
- Raios de borda suaves mas não arredondados demais (lg = 12px, não pill)
- Sombras sutis e estruturais, nunca decorativas
- Tipografia única (Inter) com hierarquia clara até que uma segunda família seja adicionada

## 2. Colors: The Neighborhood Palette

O amarelo dourado do `accent` é o único elemento cromático com temperatura. O `primary` (azul-céu) serve funções de interface. Os neutros garantem que os itens doados — as fotos, as histórias — sejam o destaque visual real.

### Primary
- **Sky Action Blue** (`#0284c7` / `#0ea5e9`): Cor de trabalho da interface. Links, estados de foco, indicadores de progresso, ícones de navegação ativa. Nunca como background de hero ou seção de marketing. O sky-600 (#0284c7) é o valor padrão em botões e interações; o sky-500 (#0ea5e9) aparece em variantes secundárias.

### Secondary
- **Fuchsia** (`#d946ef`): Presente no `tailwind.config.js` mas sem papel estratégico claro no produto atual. Candidata à remoção na próxima iteração de paleta (TCK-018). Não usar em novos componentes.

### Tertiary
- **Warm Accent Gold** (`#facc15` amber-400 / `#d97706` amber-600): O coração visual do Doe Me. Reservado para o CTA principal, destaques primários e elementos que comunicam generosidade ou ação positiva. O amber-600 (#d97706) é o hover/deep state do amber-400.

### Neutral
- **Page Background** (`#f9fafb`): gray-50. Fundo de página padrão. Subtilmente distinguível do branco puro para criar profundidade sem usar sombras.
- **Surface White** (`#ffffff`): Cards, modais, inputs, cabeçalho. O branco puro cria contraste visual sobre o fundo gray-50.
- **Ink** (`#111827`): gray-900. Texto principal, headings. Escuro mas não preto absoluto, reduz fadiga visual.
- **Muted** (`#6b7280`): gray-500. Texto secundário, labels, metadados (localização, tempo, condição do item).
- **Border** (`#e5e7eb`): gray-200. Divisores, bordas de input, separadores. O limite entre leveza e invisibilidade.

### Semantic
- **Success Green** (`#22c55e`): "Disponível" — estado de item disponível para doação.
- **Warning Amber** (`#f59e0b`): "Reservado" — item reservado mas ainda não entregue.
- **Danger Red** (`#ef4444`): "Doado" / erros de formulário.

### Named Rules
**The Accent-Is-Rare Rule.** O amarelo `accent` (#facc15) aparece em no máximo um elemento de ação por tela. Sua raridade é o ponto — quando aparece, sinaliza a ação mais importante. Nunca use como background de seção inteira ou para múltiplos CTAs simultâneos.

**The No-Fuchsia Rule.** O `secondary` (#d946ef) não deve ser usado em novos componentes. Não tem papel no vocabulário visual do Doe Me.

## 3. Typography

**Display Font:** Instrument Serif (weight 400, italic variant disponível), com fallback Georgia, ui-serif, serif.
**Body Font:** Inter (weights 400–700), com fallback ui-sans-serif, system-ui, sans-serif.

**Character:** Eixo de contraste serif + sans: Instrument Serif carrega o gesto humano das headlines de marketing; Inter carrega a clareza funcional do produto. Instrument Serif em weight 400 tem presença suficiente — não forçar bold em display. O italic é uma ferramenta válida para expressão de voz, não meramente decorativo.

### Hierarchy
- **Display** (Instrument Serif 400, clamp(2rem, 5vw, 3.5rem), line-height 1.1, letter-spacing -0.02em): Heroes de página, títulos de campanhas. Máximo um por tela. Usar `font-display` do Tailwind.
- **Headline** (700, clamp(1.5rem, 3vw, 2.25rem), line-height 1.2, letter-spacing -0.01em): H2 de seções, títulos de views principais.
- **Title** (600, 1.125rem/18px, line-height 1.4): Títulos de cards, sidebars, modais. O peso 600 distingue sem precisar de tamanho grande.
- **Body** (400, 0.9375rem/15px, line-height 1.6): Todo texto de parágrafo. Line-length máximo: 70ch em colunas de conteúdo.
- **Label** (500, 0.8125rem/13px, letter-spacing 0.01em): Metadados, badges, labels de campo, botões pequenos. Nunca em caixa alta rastreada como eyebrow de seção.

### Named Rules
**The No-Eyebrow Rule.** Nenhuma seção deve ter um label em caixa alta rastreada ("COMO FUNCIONA", "SOBRE NÓS", "CATEGORIAS") como marcador de navegação reflexo. Se um título de seção existe, ele é o h2 — com tamanho e peso, não com caixa alta.

**The Balance Rule.** Todo h1–h3 recebe `text-wrap: balance`. Parágrafos longos recebem `text-wrap: pretty`. Nunca orphans em headings.

## 4. Elevation

O sistema usa sombras estruturais, não decorativas. Superfícies ficam planas em repouso; elevação é resposta a estado (hover, foco, abertura de dropdown).

### Shadow Vocabulary
- **Resting** (`shadow-sm`: `0 1px 2px 0 rgba(0,0,0,0.05)`): Cards em repouso, cabeçalho fixo. Indica separação de camada sem peso visual.
- **Raised** (`shadow-lg`: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`): Cards em hover, dropdowns, modais. Resposta a interação.
- **Modal backdrop**: overlay semi-transparente (`bg-black bg-opacity-50`), sem blur. O blur glassmorphism é proibido.

### Named Rules
**The Flat-by-Default Rule.** Superfícies ficam planas em repouso. `shadow-sm` é permitida para cards que precisam se separar do fundo. Qualquer sombra mais agressiva que `shadow-lg` indica excesso decorativo.

## 5. Components

### Buttons
- **Shape:** Gently curved (8px radius / rounded-md). Não pill, não square.
- **Primary:** Sky-blue (#0284c7) com texto branco. Padding 10px 24px. Hover: sky-800 (#075985). Transição color 200ms.
- **Accent:** Amarelo (#facc15) com texto ink (#111827). Hover: amber-600 (#d97706). Reservado para o CTA mais importante por tela.
- **Ghost:** Texto primary, sem background, borda border-color. Para ações secundárias.
- **Focus:** `ring-2 ring-primary-500 ring-offset-2`. Nunca outline removido sem alternativa.

### Cards (DonationCard)
- **Corner Style:** Gently curved (12px / rounded-xl).
- **Background:** Surface white (#ffffff) sobre background gray-50.
- **Shadow:** shadow-sm em repouso; shadow-lg em hover. Transição 200ms.
- **Image container:** h-48, object-cover. Overlay de ações (favoritar, compartilhar) aparece em hover com bg-black bg-opacity-40. Overflow-hidden garante que o overlay não vaze.
- **Content area:** Padding 16px. Título em Title weight; descrição e metadados em Body/Label.
- **Status badge:** Posição absolute top-3 left-3. Badge de condição: top-3 right-3.

### Badges / Status
Três estados semânticos para itens de doação:
- **Disponível:** bg #dcfce7, text #166534 (green-100 / green-800).
- **Reservado:** bg #fef3c7, text #92400e (yellow-100 / amber-800).
- **Doado:** bg gray-100, text gray-700.

Todos: rounded-full, text-xs, px-2 py-1.

### Inputs / Fields
- **Style:** Borda sólida (border-gray-300), background branco, rounded-md (8px).
- **Focus:** ring-1 ring-primary-500 border-primary-500. Não shadow, não glow pesado.
- **Error:** border-danger (#ef4444), helper text text-red-600.
- **Disabled:** opacity-50, cursor-not-allowed.

### Navigation (AppHeader)
- **Style:** bg-white, border-b border-gray-200, shadow-sm. Sticky top-0 z-50.
- **Logo:** Icon 8x8 com gradient linear from-primary-500 to-secondary-500 (candidato a simplificação). Nome em text-xl font-bold.
- **Links:** text-gray-500, hover text-gray-900. Active: text-primary-600 bg-primary-50 rounded-md.
- **Mobile:** Bottom navigation bar separada (MobileNavigation.vue). Nunca hamburger menu.

### States (LoadingSpinner / ErrorState)
- **Loading:** animate-spin, border-b-2, border-primary-600. Size variants: sm/md/lg/xl.
- **Error:** Ícone grande (h-24 w-24) text-red-400. Título em Title weight, descrição em Body, botão de retry em button-primary.
- **Empty state:** Padrão similar ao error — ícone, título, descrição, CTA.

## 6. Do's and Don'ts

### Do:
- **Do** usar `#facc15` (accent gold) como o único CTA de cor quente por tela — um botão de destaque, não dois.
- **Do** usar `shadow-sm` em cards em repouso e `shadow-lg` em hover — sombras como resposta, não como decoração.
- **Do** aplicar `text-wrap: balance` em h1–h3 e `text-wrap: pretty` em parágrafos.
- **Do** limitar colunas de texto a 70ch para manter leiturabilidade em desktop.
- **Do** usar contraste mínimo 4.5:1 para texto de corpo; verificar especialmente text-gray-500 sobre fundos tintados.
- **Do** posicionar overlays de ação (favoritar, compartilhar) dentro do `overflow-hidden` do container de imagem — nunca fora.
- **Do** usar alvos de toque mínimos de 44x44px para botões e ícones de ação em mobile.

### Don't:
- **Don't** usar `border-left` maior que 1px como stripe decorativo em cards, callouts ou alertas. Nunca.
- **Don't** usar `background-clip: text` com gradiente. Gradient text é proibido no sistema.
- **Don't** usar blur/glassmorphism em modais ou cards como padrão. Reservado para casos excepcionais com intenção clara.
- **Don't** usar a fúcsia `#d946ef` (secondary) em novos componentes — não tem papel estratégico definido.
- **Don't** criar o hero-metric template: número grande + label de métricas como `+5.000 doações`. Métricas existem como contexto em prosa, não como showoff.
- **Don't** usar gradiente azul→roxo (`from-primary-600 via-primary-700 to-secondary-600`) em hero sections. Esse é o visual SaaS genérico que o Doe Me recusa explicitamente.
- **Don't** usar eyebrows de seção em caixa alta rastreada ("COMO FUNCIONA", "SOBRE NÓS"). Se o texto existe, ele é o título — h2 com tamanho.
- **Don't** usar numbered section markers (01 / 02 / 03) como scaffolding de seções. Números ganham sentido apenas quando a sequência carrega informação necessária ao leitor.
- **Don't** usar `z-index` com valores arbitrários (999, 9999). A escala semântica é: dropdown (10) → sticky header (50) → modal backdrop (40) → modal (50) → toast (60) → tooltip (70).
