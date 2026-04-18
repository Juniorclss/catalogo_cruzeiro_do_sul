# 🤖 Agentes Disponíveis - Projeto Codex

Lista de agentes personalizados criados para este projeto.

## 📱 Agente Instagram Manager

**Descrição**: Gerencia conteúdo do Instagram, planejamento de postagens, estratégia de crescimento, community management e análise de métricas.

**Disponível em**: Perfil de usuário

**Como usar**:
- Abra o chat do Copilot
- Digite `/` e procure por "Agente Instagram Manager"
- Alternatively, mention: "Agente Instagram: [sua tarefa]"

**Tarefas que pode fazer**:
- 📅 Planejar conteúdo para semana/mês
- 📊 Analisar métricas e engajamento
- 🎥 Sugerir ideias de reels, stories, posts
- ✍️ Criar captions e hashtags relevantes
- 📈 Estratégia de crescimento de seguidores
- 🤖 Sugerir automações
- 🎨 Dicas de identidade visual e estética

**Exemplo de uso**:
```
"Agente Instagram: planejar 10 ideias de reels para próxima semana"
"Agente Instagram: qual hora é melhor postar?"
"Agente Instagram: analisar meu engajamento"
```

---

## 🎨 Agente Web Design

**Descrição**: Especialista em HTML, CSS, JavaScript, design responsivo e acessibilidade web.

**Disponível em**: Perfil de usuário

**Como usar**:
- Abra o chat do Copilot
- Digite `/` e procure por "Agente Web Design"
- Ou: "Agente web design: [sua tarefa]"

**Tarefas que pode fazer**:
- 🏗️ Estruturar HTML semântico e acessível
- 🎨 Criar layouts CSS responsivos
- ⚙️ Adicionar interatividade com JavaScript
- 📱 Design responsivo (mobile, tablet, desktop)
- ♿ Garantir acessibilidade (WCAG, ARIA)
- 🐛 Corrigir problemas de layout

**Exemplo de uso**:
```
"Agente web design: criar um card responsivo"
"Agente web design: corrigir layout para mobile"
"Agente web design: tornar este site acessível"
```

---

## � Agente Moda & Modelos

**Descrição**: Edita fotos de modelos e looks com IA, voltado para o mercado de moda. Melhora corpo, rosto, iluminação, estilo e composição.

**Disponível em**: Perfil de usuário

**Como usar**:
- Abra o chat do Copilot
- Digite `/` e procure por "Agente Moda & Modelos"
- Ou: "Agente moda: [sua tarefa com foto]"

**Tarefas que pode fazer**:
- 💪 Melhorias de corpo (definição, postura, proporções)
- 😊 Retoques de rosto (pele, iluminação facial, maquiagem digital)
- 👔 Sugerir roupas, acessórios e looks
- 💡 Melhorar iluminação, contraste e cores
- 📸 Sugerir melhores poses e enquadramentos
- 🎨 Análise de estética e harmonia visual
- 📱 Preparar fotos para portfólio, Instagram, catálogos
- ✨ Efeitos profissionais e naturais

**Exemplo de uso**:
```
"Agente moda: melhorar a iluminação dessa foto de modelo"
"Agente moda: sugerir roupas que favorecem meu tipo de corpo"
"Agente moda: qual pose fica melhor para essa foto?"
"Agente moda: retocar o rosto naturalmente"
"Agente moda: criar um look completo para evento"
```

---

## 🎨 Agente Combinação de Cores

**Descrição**: Especialista em paletas, contraste, harmonia visual, gradientes e combinação de cores para interfaces, cards, hero sections e identidade visual.

**Disponível em**: Perfil de usuário

**Como usar**:
- Abra o chat do Copilot
- Digite `/` e procure por "Agente Combinação de Cores"
- Ou: "Agente cores: [sua tarefa]"

**Tarefas que pode fazer**:
- 🎨 Montar paletas equilibradas para páginas e componentes
- 🌗 Corrigir contraste e legibilidade de textos
- 🧩 Harmonizar gradientes, fundos e bordas
- 🖼️ Sugerir cores para cards com imagem ou sem imagem
- 🪄 Ajustar visual infantil, editorial, premium ou tech sem perder leitura
- 📱 Validar combinação de cores em desktop e mobile

**Exemplo de uso**:
```
"Agente cores: melhorar a paleta dessa hero infantil"
"Agente cores: deixar esses cards mais legíveis"
"Agente cores: criar uma combinação premium para meu dashboard"
```

---

## �📝 Como adicionar novos agentes

Se precisar criar mais agentes personalizados:
1. Peça ao GitHub Copilot para criar um novo agente
2. O arquivo será salvo em: `C:\Users\junio\AppData\Roaming\Code\User\prompts\`
3. Adicione aqui neste documento com a descrição

---

**Última atualização**: 11 de abril de 2026

---

## Memória operacional do Codex

- Se existir um arquivo `CODEX_MEMORY.md` na raiz do projeto, leia esse arquivo antes de continuar trabalhos já iniciados neste repositório.
- Se existir o diretório `.codex-memory/`, leia `README.md`, `current-state.md`, `handoff.md`, `orders.json` e `assets.json` antes de continuar trabalhos já iniciados neste repositório.
- Se existir `.codex-memory/credit-end-protocol.md`, leia esse arquivo em toda retomada e sempre que a sessão estiver perto do fim dos créditos.
- Se existir o diretório `.codex-review-team/`, leia `README.md` e use `npm run review:team` antes de rodadas grandes de revisão visual/editorial/funcional.
- Quando houver mudanças grandes, validações visuais, deploys ou pendências importantes, atualize `CODEX_MEMORY.md` com um resumo curto do estado atual.
- Registre cada ordem relevante do usuário na memória local estruturada (`.codex-memory/orders.json`) e vincule capturas, fotos, anexos ou textos úteis em `.codex-memory/assets.json`.
- Ao encerrar uma rodada importante, atualize `.codex-memory/current-state.md` e `.codex-memory/handoff.md` para facilitar retomada mesmo após troca de conta ou fim de créditos.
- Antes de aplicar qualquer referência visual enviada pelo usuário, confira na memória local qual página ou módulo estava em foco na ordem aberta mais recente.

## Equipe local de revisão

- A equipe fixa vive em `.codex-review-team/agents/`.
- O auditor principal fica em `scripts/review-team-audit.js` e gera `.codex-temp/review-team/latest-report.md` e `.codex-temp/review-team/latest-report.json`.
- O foco da equipe é achar vazamentos editoriais, cards sem hierarquia, CTAs confusos, links quebrados, acessibilidade básica e cobertura fraca de fontes.
- Use esse fluxo antes de revisão manual com o usuário para chegar com os problemas já triados.
