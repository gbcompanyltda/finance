# Handoff: Finance — app mobile de controle de gastos e orçamento

## Overview

Aplicativo mobile de **spend tracking + budgets** (estilo Mint) para consumidores comuns. O pacote cobre a identidade (marca combinada ícone + wordmark, ícone de app, favicon) e seis telas navegáveis: Home, Activity, Budget, Insights, folha de nova transação e Account/Settings. Inclui também uma alternativa de layout para a Home (ledger-first) e três tratamentos de gráfico para escolha.

Tom de voz: **neutro e factual**. Densidade: **balanceada**.

## About the Design Files

Os arquivos em `design/` são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento pretendidos, **não código de produção para copiar**. `Finance.dc.html` usa um runtime próprio de streaming (`support.js`), template com holes `{{ }}` e `<sc-for>/<sc-if>`; nada disso deve ir para o app.

A tarefa é **recriar essas telas no ambiente do codebase alvo** (React Native, Expo, SwiftUI, Flutter, React web…) usando os padrões, bibliotecas de navegação e componentes já estabelecidos ali. Se o projeto ainda não tiver ambiente definido, escolha o mais adequado e implemente as telas nele.

Como abrir a referência: sirva a pasta `design/` num servidor estático (`npx serve design`) e abra `Finance.dc.html`. Ela precisa de rede para a fonte Archivo (Google Fonts).

O repositório `gbcompanyltda/finance` está associado ao projeto, mas **não foi lido** durante o design — nada aqui está reconciliado com componentes, rotas ou modelo de dados reais. Trate divergências como "seguir o codebase".

## Fidelity

**High-fidelity (hifi).** Cores, tipografia, espaçamentos, estados e microcópia são finais. Recrie a UI fielmente usando as bibliotecas existentes do codebase. As duas exceções explícitas:

1. As cores de categoria são uma rampa navy→azul derivada por mim; substitua pelos tokens reais se existirem.
2. `Archivo` foi usada como stand-in geométrico para a letra "estilo Inter" pedida no brief da marca. Se o app já tem fonte de marca, use a do app.

---

## Design Tokens

### Cores

| Papel | Hex | Uso |
| --- | --- | --- |
| Navy (ink / primária) | `#0b2545` | Texto, réguas de 2px, barras, fundo do ícone de app, chip ativo |
| Accent | `#2a78d6` | CTA primário, valores de receita, destaque do mês atual, links |
| Navy 800 | `#12395f` | Categoria Shopping |
| Navy 700 | `#1d5285` | Categoria Groceries |
| Blue 400 | `#6fa8e8` | Categoria Transport |
| Blue 200 | `#b9d3f2` | Categoria Fun |
| Surface | `#ffffff` | Fundo de todas as telas |
| Canvas (board) | `#eceae5` | Só o fundo da prancheta de design; não é do app |

Derivados de `#0b2545` por alpha (use as mesmas proporções):

- `rgba(11,37,69,.05)` — fundo de cabeçalho de grupo de data
- `rgba(11,37,69,.06)` — tecla do teclado numérico, fundo da tab ativa
- `rgba(11,37,69,.09)` — avatar
- `rgba(11,37,69,.10)` / `.12` — trilho de barra de progresso
- `rgba(11,37,69,.13)` — separador de linha de lista (1px)
- `rgba(11,37,69,.18)` — coluna inativa de gráfico
- `rgba(11,37,69,.28)` — borda de chip inativo
- `rgba(11,37,69,.30)` — régua secundária de 2px
- `rgba(11,37,69,.35)` — símbolo `$` no rascunho, fundo do Save desabilitado
- `rgba(11,37,69,.42)` — ícone/label de tab inativa
- `rgba(11,37,69,.50)` — kicker em caixa alta
- `rgba(11,37,69,.55)` / `.60` — texto secundário
- `rgba(11,37,69,.45)` — backdrop do bottom sheet

Mapa de categorias (usado em pílulas de cor, barras e legendas):

```
Bills #0b2545 · Groceries #1d5285 · Dining #2a78d6
Transport #6fa8e8 · Shopping #12395f · Fun #b9d3f2 · Income #2a78d6
```

### Tipografia

Família única: **Archivo** (400, 500, 600, 700, 800, 900).

| Papel | Size / Weight / Line-height / Tracking |
| --- | --- |
| Saldo total (display) | 50 / 800 / 1 / −0.055em |
| "Left to spend" | 46 / 800 / 1 / −0.055em |
| Valor do rascunho no sheet | 44 / 800 / 1 / −0.05em |
| Wordmark grande (lockup) | 78 / 800 / 1 / −0.05em |
| Título de mês (Home alt) | 26 / 800 / 1 / −0.045em |
| Métrica secundária | 28–30 / 800 / 1 / −0.04em |
| Nome no perfil | 18 / 800 / 1.15 / −0.03em |
| Título de sheet | 18 / 800 / 1 / −0.035em |
| Wordmark no header | 17 / 800 / 1 / −0.045em |
| Valor em linha de lista | 14–15 / 700 / 1 / −0.02em |
| Nome em linha de lista | 14 / 600 / 1.2 |
| Meta em linha de lista | 11.5 / 400 / 1.4 |
| Kicker (caixa alta) | 10 / 700 / 1 / +0.14em, `text-transform: uppercase` |
| Label de tab | 9.5 / 700 / 1 / +0.02em |
| Chip / botão de texto | 12 / 700 / 1 |
| Tecla numérica | 19 / 700 / 1 |
| Rótulo do Save | 14 / 800 / 1 |

### Espaçamento

Gutter horizontal de tela: **20px** em tudo. Escala vertical usada: 3, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 22, 24, 26, 30. Padding de linha de lista: `13px 20px`. Padding de linha de budget: `16px 20px`.

### Raio, bordas e sombras

- **Border radius: 0 em toda a UI do app.** Sem exceção. As únicas curvas são: os cantos do ícone do app (38px no 172px, 13px no 58px) e o `rx` de 6px dentro do SVG da marca.
- Réguas: **2px** entre seções maiores (`#0b2545` para a principal, `rgba(11,37,69,.3)` para as secundárias); **1px** `rgba(11,37,69,.13)` entre linhas de lista.
- Sombras: só duas, ambas do navy — botão `+` flutuante `0 4px 14px rgba(11,37,69,.28)`; toast `0 6px 20px rgba(11,37,69,.3)`. Nenhum card tem sombra.

### Ícones

Lucide, stroke 2px, `stroke-linecap="round"`, `stroke-linejoin="round"`, viewBox 24. Os `d` usados nas tabs estão em `Finance.dc.html` (array `tabDef` na classe de lógica) — troque pelos ícones Lucide oficiais: `home`, `list`, `pie-chart`/`wallet`, `bar-chart-3`, `user`.

---

## A marca

Marca combinada: carteira geométrica de traço contínuo + wordmark "Finance", lidos como uma unidade. Grid de 48px, stroke 3px, raio de canto 6px, um único elemento em accent (o ponto do fecho).

Três construções foram exploradas (opção `1b` na prancheta):

1. **Wallet** — conforme o brief; é a usada no protótipo e no ícone.
2. **Wallet + trend** — mesma carteira com uma seta de tendência em accent dentro do corpo.
3. **Slot monogram** — quadrado arredondado onde os slots de cartão formam um "F".

Paths SVG exatos (viewBox `0 0 48 48`, `fill="none"`, `stroke-width="3"`):

```
flap:  M12.5 13V10.2C12.5 8.3 14.2 6.9 16.1 7.3L33.6 11        (stroke-linecap round)
corpo: M12 13H36C39.3 13 42 15.7 42 19V35C42 38.3 39.3 41 36 41H12C8.7 41 6 38.3 6 35V19C6 15.7 8.7 13 12 13Z
fecho: M42 23H33C30.8 23 29 24.8 29 27C29 29.2 30.8 31 33 31H42
ponto: circle cx=34.6 cy=27 r=2.1  fill=#2a78d6
```

Regras de escala: aos **24px e abaixo** remova a aba (`flap`) e o ponto do fecho e aumente o stroke — 32px → 4, 24px → 4.6, 16px → 5.6. O corpo + a abertura do fecho sustentam a leitura.

Lockups: primário (horizontal, gap 24px, ícone 96px + wordmark 78px), empilhado, reverso (branco sobre `#0b2545`, ponto do fecho vira `#6fa8e8`), favicon 32/24/16. Ícone de app: quadrado navy, raio 38/172 ≈ 22%, glifo branco a ~58% da largura, ponto em accent.

---

## Screens / Views

Frame de referência: **402 × 874** (iPhone). Área de conteúdo: `padding: 60px 0 24px` (60 = status bar, 24 = home indicator). Todas as telas: fundo `#ffffff`, gutter 20px, tudo alinhado à esquerda.

### Chrome comum (telas 1–5 do protótipo)

- **Header**, `flex: none`, `padding: 0 20px 14px`: à esquerda o glifo da carteira 23px (stroke 4, sem aba/ponto) + título 17/800/−0.045em; à direita avatar 30×30 `rgba(11,37,69,.09)` com iniciais "JR" 11/700. Título muda por tela: `Finance`, `Activity`, `Budget`, `Insights`, `Account`.
- Abaixo do header, régua **2px `#0b2545`**.
- **Área de rolagem** `flex: 1; overflow: auto`.
- **Tab bar**, `flex: none`, régua 2px `#0b2545` no topo, 5 tabs `flex: 1`, cada uma `padding: 11px 0 4px`, coluna, `gap: 5px`, ícone 21px + label 9.5/700. Ativa: ícone e label `#0b2545`, fundo `rgba(11,37,69,.06)`. Inativa: `rgba(11,37,69,.42)`, fundo branco. Tabs: Home · Activity · Budget · Insights · Account.
- **Botão `+` flutuante**: 54×54, `#2a78d6`, `position: absolute; right: 18px; top: -64px` relativo ao container da tab bar (ou seja, 64px acima dela), ícone plus branco stroke 2.4, sombra `0 4px 14px rgba(11,37,69,.28)`. Abre o sheet de nova transação.

### 1. Home

**Propósito:** ver saldo, contas e ritmo de gasto do mês em um scroll.

Ordem dos blocos:

1. **Saldo** (`padding: 24px 20px 20px`): kicker "TOTAL BALANCE"; valor `$12,480.65` a 50/800/−0.055em; abaixo, chip sólido `#0b2545` com texto branco `+2.4%` (11/700, padding `3px 7px`) + "vs. last month" 12/400 em `rgba(11,37,69,.6)`; sparkline SVG full-width 56px de altura, polyline navy stroke 2.5 com ponto final `#2a78d6` r=4.
2. Régua 2px `rgba(11,37,69,.3)`.
3. **Accounts** — kicker + 3 linhas, cada uma `padding: 14px 20px`, `space-between`, separador 1px: nome 14/600 + meta 11.5/400 à esquerda, valor 15/700/−0.02em à direita.
   - Everyday Checking · Chase · 4417 · `$3,184.22`
   - Savings · Chase · 8802 · `$9,612.40`
   - Sapphire Card · Statement Sep 24 · `−$315.97`
4. **September spending** (`padding: 24px 20px 20px`): kicker à esquerda, "N% used" 11/700 em accent à direita; valor gasto 28/800/−0.04em e "of $3,220" 12/400 na mesma baseline (`align-items: flex-end`); barra 10px de altura, trilho `rgba(11,37,69,.12)`, preenchimento `#0b2545` com largura = gasto/orçamento (teto 100%).
5. Régua 2px `rgba(11,37,69,.3)`.
6. **Recent** — kicker + "All activity" 11/700 accent (navega para Activity); 3 linhas de transação.

**Linha de transação** (padrão reutilizado em Home e Activity): `padding: 13px 20px`, `gap: 13px`, separador 1px. Pílula de cor de categoria 8×34 na cor da categoria; nome 14/600 com ellipsis; meta `Categoria · Data` 11.5/400; valor 14/700/−0.02em, `−$` navy para despesa e `+$` accent para receita (usar o sinal `−` U+2212, não hífen).

### 2. Activity

**Propósito:** varrer e filtrar todas as transações.

- **Barra de filtro** `padding: 16px 20px`, `gap: 8px`, régua inferior 2px `rgba(11,37,69,.3)`. Três chips: All · Spending · Income. Chip `padding: 8px 13px`, 12/700, raio 0. Ativo: fundo `#0b2545`, texto branco, borda `#0b2545`. Inativo: fundo branco, texto navy, borda 1px `rgba(11,37,69,.28)`.
- **Linha de resumo** `padding: 16px 20px 10px`: "N transactions" como kicker à esquerda, soma dos valores absolutos filtrados 13/700 à direita.
- **Lista agrupada por data.** Cabeçalho de grupo: `padding: 10px 20px 8px`, fundo `rgba(11,37,69,.05)`, texto kicker, régua 1px acima e abaixo. Grupos preservam a ordem de chegada das transações (Today, Yesterday, Sep 4, Sep 3, Sep 2, Sep 1).
- Nas linhas desta tela a meta é só a categoria (sem data — já está no cabeçalho do grupo).

### 3. Budget

**Propósito:** ver quanto resta por categoria no período.

- **Cabeçalho** `padding: 22px 20px 18px`: kicker "LEFT TO SPEND · SEPTEMBER"; valor 46/800/−0.055em; linha de apoio 12/400 "24 days left in the period · $X a day".
- Régua 2px `#0b2545`.
- **Seis linhas de categoria**, `padding: 16px 20px`, separador 1px: nome 14/600 à esquerda e "$usado of $limite" 12/400 à direita na mesma baseline; abaixo, `margin-top: 10px`, barra 8px, trilho `rgba(11,37,69,.12)`, preenchimento na cor da categoria — **exceto acima de 90% do limite, onde vira `#2a78d6`** (é o único sinal de alerta; não usar vermelho).
- Limites: Bills 1900 · Groceries 600 · Dining 250 · Shopping 200 · Transport 150 · Fun 120. "Left" = soma dos limites − total gasto no mês.

### 4. Insights

**Propósito:** ver tendência de 6 meses e para onde o dinheiro foi.

- **Switcher de gráfico** — mesma barra de chips da Activity: Columns · Line · Rows. (Na entrega final, escolha um tratamento e remova o switcher; ele existe para você comparar — ver opção `1f` na prancheta.)
- **Cabeçalho** `padding: 22px 20px 10px`: kicker "MONTHLY SPEND · LAST 6"; média 30/800/−0.045em seguida de " avg" 12/400.
- **Columns**: faixa de 150px, `gap: 10px`, régua inferior 2px `#0b2545`; cada coluna `flex: 1`, valor arredondado sem `$` em 10/700 acima da barra, altura = valor/máx, cor `rgba(11,37,69,.2)` e **`#2a78d6` só no mês atual**; rótulos de mês 10/600 abaixo da régua.
- **Line**: SVG 320×150, `preserveAspectRatio="none"`, duas gridlines horizontais 1px `rgba(11,37,69,.18)`, área `rgba(42,120,214,.16)`, linha navy stroke 2.5, régua inferior 2px.
- **Rows**: uma linha por mês, `padding: 9px 0`, separador 1px: rótulo 34px 11/700 · trilho `flex: 1` 14px com preenchimento na cor · valor 62px alinhado à direita 12/700.
- Régua 2px `rgba(11,37,69,.3)`, kicker "WHERE IT WENT", e até 5 linhas de categoria ordenadas por gasto: quadrado 10×10 na cor · nome 13.5/600 · share em % (38px, direita) · valor 13.5/700 (70px, direita).

### 5. Account

**Propósito:** perfil, preferências, dados, saída.

- **Bloco de perfil** `padding: 22px 20px`, régua inferior 2px `#0b2545`: bloco 54×54 `#0b2545` com "JR" branco 19/800; nome 18/800/−0.03em; meta "jordan@reyes.co · 3 accounts linked" 12/400.
- **Seis linhas** `padding: 15px 20px`, separador 1px, `space-between`: label 14/600 + meta 11.5/400 à esquerda; à direita um **toggle** ou um **link**.
  - Toggle: trilho 44×24 (raio 0), ligado `#0b2545` / desligado `rgba(11,37,69,.22)`; knob 18×18 branco, `top: 3px`, `left: 3px → 23px`, transição `left .15s` e `background .15s`.
  - Round-ups to Savings (toggle, ligado) · Overspend alerts (toggle, ligado) · Linked accounts → "Manage" · Categories → "Edit" · Export data → "Export" · Security → "Open". Links em 12/700 `#2a78d6`.
- **Sign out**: `padding: 13px 16px`, borda 2px `#0b2545`, label 13/800 navy, **alinhado à esquerda** (regra do sistema: nunca centralizar label de botão largo).

### 6. New transaction (bottom sheet)

**Propósito:** lançar uma despesa em poucos toques.

- Overlay `position: absolute; inset: 0`, backdrop `rgba(11,37,69,.45)`; a área acima do sheet é clicável e fecha.
- Painel: fundo branco, borda superior 2px `#0b2545`, `padding: 20px 20px 30px`, ancorado no rodapé.
- Título "New transaction" 18/800/−0.035em à esquerda; "Cancel" 12/700 `rgba(11,37,69,.55)` à direita.
- **Display do valor**: `margin-top: 18px`, `padding-bottom: 14px`, régua inferior 2px `#0b2545`; `$` 34/800 em `rgba(11,37,69,.35)` + dígitos 44/800/−0.05em navy. Vazio mostra `0`.
- Kicker "CATEGORY" + chips (mesmo estilo dos filtros, `flex-wrap`, `gap: 8px`): Groceries · Dining · Transport · Bills · Shopping · Fun. Padrão: Groceries.
- **Teclado numérico**: grid 3 colunas, `gap: 8px`, teclas `padding: 14px 0`, centralizadas, 19/700, fundo `rgba(11,37,69,.06)`. Ordem `1 2 3 / 4 5 6 / 7 8 9 / . 0 ⌫`.
- **Save transaction**: `padding: 15px 16px`, texto branco 14/800 **alinhado à esquerda**; fundo `#2a78d6` quando o valor > 0, `rgba(11,37,69,.35)` quando inválido.

### 7. Toast

`position: absolute; left/right: 20px; bottom: 96px`, fundo `#0b2545`, texto branco 12.5/600, `padding: 13px 15px`, sombra `0 6px 20px rgba(11,37,69,.3)`. Auto-dismiss em **2600ms**. Mensagens: `"$84.20 logged to Groceries."` e `"Enter an amount first."`.

### Alternativa — Home ledger-first (opção `1e`)

Mesma linguagem, hierarquia invertida: saldo total desaparece, o extrato domina.

- Header: "September" 26/800/−0.045em à esquerda; "Sep 2026" 11/700 accent + avatar 28×28 à direita. Régua 2px.
- **Duas células iguais** (grid 1fr 1fr, divisor vertical 1px, régua inferior 2px): "SPENT" `$2,096` navy · "LEFT" `$1,124` em accent, ambos 26/800/−0.04em.
- **Barra empilhada** 16px de altura, segmentos proporcionais por categoria (Bills 24% · Groceries 19% · Dining 14% · Transport 11% · resto `rgba(11,37,69,.12)`), seguida de legenda com quadrados 9×9 e labels 10.5/600.
- Extrato ocupando o resto da altura, agrupado por data; linha mais compacta (sem pílula de cor): nome · categoria 11/400 · valor (74px, direita).
- Rodapé de ação: régua 2px, "Ledger" 13/800 à esquerda e bloco `#2a78d6` de 120px com "Add" branco 13/800 à direita.

Decida com o time se esta ou a Home padrão vai para o build; **não implemente as duas**.

---

## Interactions & Behavior

- **Navegação por tab**: troca de tela instantânea, sem transição. Trocar de tab fecha o sheet aberto. Estado de filtro e de gráfico persiste entre trocas de tab.
- **Botão `+`**: abre o sheet. Fechar (Cancel ou toque no backdrop) **limpa o rascunho de valor** mas preserva a categoria escolhida.
- **Teclado numérico**: máximo 2 casas decimais; máximo 7 dígitos; um único ponto decimal; ponto num campo vazio produz `0.`; primeiro dígito substitui um `0` isolado; `⌫` remove o último caractere.
- **Save**: se o valor for 0/vazio/inválido → toast `"Enter an amount first."` e o sheet permanece aberto. Se válido → cria a transação no topo da lista com `date: "Today"` e nome `"<Categoria> purchase"`, fecha o sheet, **navega para a Home** e mostra o toast de confirmação. Todos os agregados (saldo do mês, barras de budget, coluna de setembro, "where it went", "left to spend") recalculam a partir da mesma lista — nada é hardcoded.
- **Chips de filtro**: All / Spending (`v < 0`) / Income (`v > 0`); atualizam contagem, soma e agrupamento.
- **Switcher de gráfico**: alterna a visualização; dados idênticos nos três.
- **Toggles**: alternam e persistem no estado da sessão.
- **Hover/press**: no protótipo tudo interativo é `cursor: pointer` sem estado de hover próprio (é mobile). No app, siga o sistema: tint de press vindo da rampa do accent; foco de teclado `outline: 2px solid` accent com `outline-offset: 2px` — nunca o anel azul default.
- **Transições**: apenas o knob do toggle (`left .15s`, `background .15s`). Sem animação de rota, sem fade de lista.
- **Estados ausentes** que você precisará projetar com o time: loading/skeleton, lista vazia, erro de sincronização de conta, offline.
- **Responsivo**: desenhado para 402px de largura. A largura é fluida (nada com largura fixa exceto colunas de valor de 62/70/74px); a altura assume viewport de telefone com header e tab bar fixos e uma única área rolável.

## State Management

Estado local de sessão, nenhuma chamada de rede no protótipo:

| Estado | Tipo | Padrão | Dispara |
| --- | --- | --- | --- |
| `screen` | `'home' \| 'spend' \| 'budget' \| 'insights' \| 'more'` | `'home'` | tab, "All activity", Save |
| `filter` | `'All' \| 'Spend' \| 'Income'` | `'All'` | chips da Activity |
| `chart` | `'bars' \| 'area' \| 'rows'` | `'bars'` | switcher dos Insights |
| `addOpen` | boolean | `false` | botão `+`, Cancel, backdrop, Save |
| `draft` | string (dígitos) | `''` | teclado numérico |
| `draftCat` | string | `'Groceries'` | chips de categoria |
| `toast` | string | `''` | Save; timer de 2600ms limpa |
| `roundUps`, `alerts` | boolean | `true` | toggles do Account |
| `txs` | `{ name, cat, v, date }[]` | 9 registros seed | Save adiciona no topo |

Derivados (calcule, não guarde): total do mês, % do orçamento, totais por categoria, top categorias com share, linhas de budget com %, série de 6 meses e média, agrupamento por data, contagem e soma do filtro.

Na integração real, `txs` vem da API do repositório e `roundUps`/`alerts` das preferências do usuário; o resto pode continuar derivado no cliente.

### Dados seed (setembro de 2026)

```
Whole Foods         Groceries    −84.20    Today
Lyft                Transport    −12.40    Today
Blue Bottle         Dining        −6.75    Yesterday
Alamo Drafthouse    Fun          −28.00    Yesterday
Trader Joe's        Groceries    −41.10    Sep 4
Uniqlo              Shopping     −62.00    Sep 3
Spotify             Bills        −11.99    Sep 2
Rent — Fillmore St  Bills      −1850.00    Sep 1
Salary — Acme Co    Income     +4200.00    Sep 1
```

Série de 6 meses (Insights): Apr 1712 · May 2174 · Jun 1449 · Jul 2410 · Aug 1980 · Sep = total calculado do mês.

Formatação de moeda: `en-US`, sempre 2 decimais nas listas e nos saldos; valores arredondados sem centavos nos agregados (barras, budgets, "left to spend"). Sinal negativo é `−` (U+2212).

## Assets

- **Nenhum bitmap.** Marca, ícone de app e favicons são o SVG documentado acima; ícones de interface são Lucide.
- **Fonte**: Archivo, do Google Fonts. Empacote a fonte no app em vez de carregar por CDN.
- **Design system**: `design/_ds/modernist-…/styles.css` traz os tokens do sistema Modernist (grid visível, réguas de 2px, raio 0, tudo alinhado à esquerda, Archivo). O guia está em `readme.md` na mesma pasta. Atenção: o accent do sistema é vermelho `#ec3013`; **este produto sobrescreve o accent para navy/azul** conforme o brief da marca. Herde a estrutura e a tipografia do sistema, não a cor.

## Screenshots

Renderizados em 2–3× a partir do protótipo, em `screenshots/`:

| Arquivo | Conteúdo |
| --- | --- |
| `01-lockup-sheet.png` | Lockup primário, empilhado, reverso e favicons 32/24/16 |
| `02-mark-alternatives.png` | As três construções de marca (wallet · wallet+trend · slot monogram) |
| `03-app-icon.png` | Ícone de app 172px + variantes navy / light / accent a 58px |
| `04-home.png` | Home — saldo, sparkline, contas, gasto do mês, recentes |
| `05-activity.png` | Activity — chips de filtro, resumo, lista agrupada por data |
| `06-budget.png` | Budget — "left to spend" e as seis categorias com barras |
| `07-insights.png` | Insights — tratamento "Columns" + "where it went" |
| `08-account.png` | Account — perfil, toggles, links, Sign out |
| `09-home-alt-ledger.png` | Home alternativa (ledger-first) |
| `10-chart-treatments.png` | Os três tratamentos de gráfico lado a lado (A/B/C) |
| `11-new-transaction-sheet.png` | Bottom sheet com valor `$42.50` e Dining selecionado |

Os tratamentos "Line" e "Rows" dos Insights não têm captura própria — veja `10-chart-treatments.png` (B e C), que mostra os mesmos desenhos em escala maior.

## Files

```
design/Finance.dc.html   — prancheta completa: 1a lockup · 1b marcas alternativas · 1c ícone de app
                            1d protótipo de 6 telas · 1e Home alternativa · 1f tratamentos de gráfico
design/support.js        — runtime do protótipo (não portar)
design/ios-frame.jsx     — moldura de iPhone só para apresentação (não portar)
design/_ds/modernist-…/  — stylesheet de tokens + guia do design system
```

Dentro de `Finance.dc.html`: o template fica entre `<x-dc>` e `</x-dc>`; toda a lógica, dados seed e valores derivados ficam na classe `Component` no `<script data-dc-script>` ao final do arquivo — é a melhor fonte para regras exatas de cálculo e formatação.
