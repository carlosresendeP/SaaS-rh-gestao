# PLANNING — FRONTEND
## MakerStack RH · Hackathon #01

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| Formulários | React Hook Form + Zod |
| Estado global | Zustand |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios (interceptors JWT) |
| Ícones | Lucide React |
| Toasts | Sonner |
| Fonte | Montserrat (Google Fonts) |
| Deploy | Vercel |
| API Base | `http://localhost:3333` (dev) / Railway (prod) |

---

## Design System

### Paleta de Cores

| Token CSS | Cor | Hex | Uso |
|---|---|---|---|
| `--primary` | Verde Neon | `#C4FF57` | Botões principais, CTA, ring |
| `--sidebar` | Verde Floresta | `#597048` | Sidebar background |
| `--background` | Off White | `#F5F7F0` | Fundo das páginas |
| `--secondary` | Kraft | `#D6B48B` | Elementos secundários, bordas |
| `--destructive` | Coral | `#FF9E6E` | Alertas, erros, ações destrutivas |
| `--accent` | Azul Acinzentado | `#7BB3B0` | Info, estados ativos |
| `--muted-foreground` | Cinza | `#8D9999` | Labels, texto secundário |
| `--foreground` | Chumbo | `#4A5452` | Texto principal |

### Tipografia

- **Display / UI:** Montserrat (400, 500, 600, 700) — carregada via Google Fonts
- **Mono (código):** JetBrains Mono — para números, tokens, dados técnicos
- **Escala:** `text-xs` (labels), `text-sm` (corpo), `text-base` (destaque leve), `text-lg/xl/2xl` (headings)

### Raio de Borda

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 0.45rem | Badges, chips |
| `--radius-md` | 0.6rem | Inputs, botões |
| `--radius-lg` | 0.75rem | Cards (padrão) |
| `--radius-xl` | 1.05rem | Modais, sheets |

### Princípios de UI

1. **Densidade > beleza** — interface densa de informação, sem hero vazio nem padding excessivo
2. **Estados sempre explícitos** — loading (Skeleton), vazio (EmptyState), erro, sucesso em toda UI
3. **Acessibilidade real** — foco visível, contraste WCAG AA, labels em todo input
4. **Forms via RHF + Zod** — validação no front espelha o backend, feedback imediato
5. **Mobile-first somente onde importa** — portal do candidato `/teste/[token]` precisa ser 100% mobile; dashboard pode ser desktop-first

---

## Arquitetura

### Decisões Críticas

- **Sem Server Actions** — toda mutação é `fetch`/Axios para a API Fastify
- **Sem NextAuth** — JWT puro, armazenado em `localStorage`
- **Client Components por padrão** — o app interno é SPA dentro do Next.js; RSC só para landing e páginas estáticas
- **Sem dark mode** (MVP) — stretch goal pós-hackathon
- **Sem i18n** — tudo PT-BR
- **Sem paginação** — volume de dados do MVP é baixo

### Grupos de Rota

```
app/
├── (marketing)/          → público, sem auth (landing, login, cadastro)
├── (app)/                → autenticado, com sidebar + topbar
└── teste/[token]/        → portal white-label público do candidato
```

### Fluxo de Auth

```
1. Usuário faz login → POST /auth/login → recebe { token, user }
2. Token salvo em localStorage via tokenStorage
3. Axios interceptor injeta Authorization: Bearer <token> em toda request
4. Axios interceptor 401 → limpa token → redirect /login
5. AppLayout chama hydrate() no mount → GET /auth/me → popula Zustand store
6. AuthGuard no AppLayout redireciona /login se !isAuthenticated após 300ms
```

---

## Estrutura de Pastas

> **Nota sobre a landing page:** `app/page.tsx` (raiz) é a landing page.
> O grupo `(marketing)` é usado apenas por `login` e `cadastro` — que precisam de um
> layout sem sidebar compartilhado. Isso evita conflito de rota entre
> `app/page.tsx` e `app/(marketing)/page.tsx`.

```
frontend/
├── app/
│   ├── page.tsx                     → LANDING PAGE (raiz — URL: /)
│   │
│   ├── (marketing)/
│   │   ├── layout.tsx               → layout público (sem sidebar)
│   │   ├── login/page.tsx           → URL: /login
│   │   └── cadastro/page.tsx        → URL: /cadastro
│   │
│   ├── (app)/
│   │   ├── layout.tsx               → AuthGuard + Sidebar + Topbar + QueryProvider
│   │   ├── onboarding/
│   │   │   ├── layout.tsx           → WizardStepper
│   │   │   ├── etapa-1/page.tsx     → Dados cadastrais + logo
│   │   │   ├── etapa-2/page.tsx     → Organograma
│   │   │   ├── etapa-3/page.tsx     → Testes dos colaboradores
│   │   │   └── etapa-4/page.tsx     → Contexto da empresa
│   │   ├── dashboard/page.tsx
│   │   ├── vagas/
│   │   │   ├── page.tsx             → Lista de vagas
│   │   │   ├── nova/
│   │   │   │   ├── page.tsx         → Escolha de fluxo (IA vs Manual)
│   │   │   │   ├── com-ia/page.tsx
│   │   │   │   └── manual/page.tsx
│   │   │   └── [id]/page.tsx        → Detalhe + relatório de match
│   │   ├── organograma/page.tsx
│   │   ├── chat/page.tsx
│   │   └── configuracoes/page.tsx
│   │
│   ├── teste/[token]/
│   │   ├── layout.tsx               → Header white-label com logo da empresa
│   │   ├── page.tsx                 → Boas-vindas + aceite LGPD
│   │   ├── disc/page.tsx
│   │   ├── eneagrama/page.tsx
│   │   ├── personalidades/page.tsx
│   │   └── concluido/page.tsx
│   │
│   ├── globals.css
│   └── layout.tsx                   → root: fontes + QueryProvider + Toaster
│
├── components/
│   ├── ui/                          → shadcn (não modificar diretamente)
│   ├── providers/
│   │   └── QueryProvider.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── AuthGuard.tsx
│   │   └── EmptyState.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── SocialProofSection.tsx
│   │   └── CtaSection.tsx
│   ├── onboarding/
│   │   ├── WizardStepper.tsx
│   │   ├── DadosCadastraisForm.tsx
│   │   ├── OrganogramaForm.tsx
│   │   ├── OrganogramaTree.tsx
│   │   ├── ColaboradoresTestes.tsx
│   │   └── ContextoEmpresaForm.tsx
│   ├── vagas/
│   │   ├── JobsList.tsx
│   │   ├── JobRow.tsx
│   │   ├── NewJobChoice.tsx
│   │   ├── JobBriefingForm.tsx
│   │   ├── JobManualForm.tsx
│   │   ├── CandidatesRepeater.tsx
│   │   └── JdPreview.tsx
│   ├── relatorio/
│   │   ├── MatchReport.tsx
│   │   ├── RankingSidebar.tsx
│   │   ├── CandidateAnalysis.tsx
│   │   ├── ScoreNumeral.tsx
│   │   ├── PointsList.tsx
│   │   └── DesafioCard.tsx
│   ├── organograma/
│   │   ├── OrgTree.tsx
│   │   ├── OrgNode.tsx
│   │   └── AddNodeDialog.tsx
│   ├── chat/
│   │   ├── ChatPage.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatInput.tsx
│   ├── testes/
│   │   ├── TestProgressBar.tsx
│   │   ├── DiscQuestion.tsx
│   │   ├── ScaleQuestion.tsx
│   │   ├── TestNav.tsx
│   │   └── ResultSummary.tsx
│   └── shared/
│       ├── CopyButton.tsx
│       ├── LoadingButton.tsx
│       ├── ConfirmDialog.tsx
│       └── TableSkeleton.tsx
│
├── lib/
│   ├── api.ts                       → Axios + interceptors JWT
│   ├── utils.ts                     → cn(), formatDate(), formatRelative()
│   └── tokens.ts                    → get/set/clear localStorage
│
├── services/
│   ├── auth.service.ts
│   ├── company.service.ts
│   ├── organograma.service.ts
│   ├── job.service.ts
│   ├── candidate.service.ts
│   ├── test.service.ts
│   └── match.service.ts
│
├── store/
│   └── auth.store.ts                → Zustand: user + token + hydrate
│
├── hooks/
│   ├── useAuth.ts
│   ├── useJobs.ts
│   ├── useCandidates.ts
│   ├── useOrganograma.ts
│   ├── useViaCep.ts
│   └── useChatStream.ts
│
└── types/
    └── api.ts
```

---

## Páginas

### 1. Landing Page — `/`

**Objetivo:** converter visitantes em cadastros. Estética séria mas com personalidade — sem clichês de SaaS genérico.

**Seções:**
- **Navbar** — logo + links âncora + botão "Entrar" (outline) + "Começar grátis" (primary `#C4FF57`)
- **Hero** — headline forte, subheadline de 1 linha, CTA duplo, mockup do dashboard ao lado
- **Como funciona** — 3 passos: Crie a vaga → Candidatos fazem o teste → IA gera o relatório
- **Features** — 4 cards: JD com IA, Testes DISC/Eneagrama, Match Score, Organograma
- **Social Proof** — logos de empresas fictícias + 2 depoimentos
- **CTA Final** — fundo Verde Floresta, texto Off White, botão Verde Neon
- **Footer** — links, copyright

**Componentes-chave:** `HeroSection`, `FeaturesSection`, `HowItWorksSection`, `CtaSection`

---

### 2. Login — `/(marketing)/login`

**Layout:** two-panel — esquerda brand (Verde Floresta + Neon), direita form.

**Campos:** email + senha
**Ação:** `POST /auth/login` → `setAuth(user, token)` → redirect `/dashboard`
**Links:** "Esqueci minha senha" (stretch), "Criar conta"

---

### 3. Cadastro — `/(marketing)/cadastro`

**Campos:** Nome, Email, Senha, Razão Social, CNPJ
**Ação:** `POST /auth/signup` → `setAuth` → redirect `/onboarding/etapa-1`

---

### 4. Onboarding — `/(app)/onboarding`

WizardStepper com 4 etapas. Progresso salvo no backend via `PATCH /company/onboarding/:step`.

| Etapa | Página | Conteúdo |
|---|---|---|
| 1 | `etapa-1` | Razão Social, CNPJ, CEP (ViaCEP), endereço, upload logo |
| 2 | `etapa-2` | Montar organograma — lista indentada + Dialog para adicionar nós |
| 3 | `etapa-3` | Testes dos colaboradores — tabs "Já tenho resultados" / "Gerar links" |
| 4 | `etapa-4` | Contexto da empresa — tipo, valores (chips), desafios, estilo liderança |

**Após etapa 4:** redirect `/dashboard`

---

### 5. Dashboard — `/(app)/dashboard`

**Layout:** sidebar esquerda (Verde Floresta) + área principal (Off White).

**Conteúdo:**
- Saudação personalizada com nome do usuário
- 4 KPI cards: Vagas Abertas, Candidatos Ativos, Em Entrevista, Aprovados este mês
- Funil de recrutamento horizontal com contagens por status
- Lista inline das vagas mais recentes com status badge
- Botão flutuante Chat IA (bottom-right)

---

### 6. Vagas — `/(app)/vagas`

**Lista:**
- Tabela densa com: título, data, candidatos, status badge, ação
- Loading: `TableSkeleton`
- Vazio: `EmptyState` com ícone Briefcase
- Botão "Nova Vaga" no header

**Detalhe de Vaga — `/(app)/vagas/[id]`:**
- Header: título + status + botão "Gerar Match com IA"
- 2 colunas: `RankingSidebar` (lista ranqueada) + `CandidateAnalysis` (relatório completo)
- `CandidateAnalysis` contém: score hero, pontos fortes, pontos de atenção, como liderar, match com cultura, perguntas de entrevista, desafio prático

---

### 7. Nova Vaga — `/(app)/vagas/nova`

**Escolha de fluxo** (`/nova`): dois cards clicáveis — "Criar com IA" e "Inserir manualmente"

**Fluxo A — Com IA** (`/nova/com-ia`):
1. Form: Cargo, Líder (Select do organograma), Motivo, Responsabilidades, Metas
2. `POST /jobs` → `POST /jobs/:id/generate-jd` (loading ~10s com skeleton animado)
3. `JdPreview` com JD gerada em card editável, borda Verde Neon
4. Botão "Publicar vaga" → `PATCH /jobs/:id { status: "ABERTA" }` → redirect `/vagas/:id`

**Fluxo B — Manual** (`/nova/manual`):
1. Form da vaga + `CandidatesRepeater` (adicionar N candidatos com nome, email, CV, resultados de testes)
2. "Ver Match" → `POST /jobs` → adiciona candidatos → `POST /jobs/:id/match`
3. Loading ~20s com skeleton → redirect `/vagas/:id`

---

### 8. Organograma — `/(app)/organograma`

- Canvas com árvore hierárquica de nós
- Nó raiz: Verde Floresta | Nível médio: Azul Acinzentado | Folhas: Kraft
- Topbar: botão "+ Adicionar Posição" + controles de zoom
- Clique no nó: abre painel direito — editar nome, cargo, líder, deletar
- Dados: `GET /organograma` via `useOrganograma` hook

---

### 9. Chat IA — `/(app)/chat`

- Layout full-page (não sheet, é página dedicada)
- Coluna esquerda 70%: histórico de mensagens com streaming SSE
  - Bubble do usuário: fundo Verde Neon, texto Chumbo
  - Bubble da IA: fundo branco, borda Kraft
- Coluna direita 30%: painel de contexto — stats da empresa + sugestões de perguntas
- Input fixo no rodapé com textarea + botão enviar

---

### 10. Configurações — `/(app)/configuracoes`

Tabs: **Empresa** | **Plano**

- **Empresa:** upload logo (drag & drop), nome, razão social, CNPJ (readonly), valores (tag editor), perfil de ritmo (card picker)
- **Plano:** informações do plano atual (stretch goal)

---

### 11. Portal do Candidato — `/teste/[token]`

**Totalmente público, mobile-first, white-label.**

| Página | Conteúdo |
|---|---|
| `/teste/[token]` | Boas-vindas, nome da empresa, logo, instrução, aceite LGPD, botão "Iniciar" |
| `/teste/[token]/disc` | Teste DISC — pares forçados (mais/menos) |
| `/teste/[token]/eneagrama` | Escala Likert 1-5 |
| `/teste/[token]/personalidades` | Escala Likert 1-5 (16 personalidades) |
| `/teste/[token]/concluido` | Tela de conclusão com agradecimento |

**Estado das respostas:** `sessionStorage` (sobrevive refresh sem login)
**Submit final:** `POST /public/tests/:token/submit` na página `personalidades`

---

## Tipos (`types/api.ts`)

Os tipos do frontend espelham diretamente o `schema.prisma` do backend.
**Nunca invente tipos** — se o campo não existe no schema, não existe no tipo.

### Enums

```ts
type JobStatus = "ABERTA" | "FECHADA" | "PAUSADA"

type ApplicationStatus =
  | "PENDENTE" | "EM_ANALISE" | "TESTE_PSICOMETRICO"
  | "ENTREVISTA" | "APROVADO" | "REPROVADO"
```

### Modelos principais

| Interface | Modelo Prisma | Observação |
|---|---|---|
| `Company` | `Company` | `valores` é `string[]` |
| `AuthUser` | `User` | sem `password` |
| `Job` | `Job` | `salaryMin/Max` vem como `string` (Decimal serializado) |
| `Candidate` | `Candidate` | inclui `personality?: PersonalityResult` |
| `Application` | `Application` | inclui `matchResultJson: MatchReport \| null` |
| `OrganogramaNode` | `OrganogramaNode` | `parentId: string \| null` |
| `PersonalityResult` | `PersonalityResult` | |
| `TestLink` | `TestLink` | |

### Match Report (JSON da IA)

Estrutura armazenada em `Application.matchResultJson`:

```ts
interface MatchReport {
  matchScore: number          // 0-100
  resumoExecutivo: string
  pontosFortes: PontoForte[]
  pontosAtencao: PontoAtencao[]
  comoLiderarEsseCandidato: ComoLiderar
  matchComCultura: MatchCultura
  perguntasComplementares: string[]
  desafioPratico: DesafioPratico
}
```

### Wrapper de resposta

```ts
interface ApiResponse<T> { ok: true;  data: T }
interface ApiError       { ok: false; error: string; fieldErrors?: Record<string, string[]> }
```

---

## Dependências a Instalar

O projeto já tem: `next`, `react`, `tailwindcss`, `shadcn`, `radix-ui`, `lucide-react`, `clsx`, `tailwind-merge`, `tw-animate-css`.

**Faltam instalar:**

```bash
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form @hookform/resolvers zod
pnpm add axios
pnpm add sonner
```

**Componentes shadcn a adicionar:**

```bash
pnpm dlx shadcn@latest add \
  button card dialog input select tabs badge avatar \
  dropdown-menu form textarea separator skeleton tooltip \
  alert label switch sheet accordion radio-group \
  checkbox sonner table progress
```

---

## Padrões de Código

### Client vs Server Components

```tsx
// Server Component — OK para páginas estáticas e layouts sem estado
export default function LandingPage() { ... }

// Client Component — obrigatório quando há hooks, eventos, localStorage
"use client"
export default function DashboardPage() { ... }
```

### Chamada de API

```tsx
// ✅ Via hook (TanStack Query)
const { data: jobs, isLoading } = useJobs()

// ✅ Via mutation
const createJob = useCreateJob()
createJob.mutate({ titulo: "Dev Senior" })
```

### Formulários

```tsx
// Sempre React Hook Form + Zod
const schema = z.object({ email: z.string().email() })
const form = useForm({ resolver: zodResolver(schema) })
```

### Tratamento de Estados

Toda UI deve cobrir os 4 estados:

```tsx
if (isLoading) return <TableSkeleton rows={4} />
if (error)     return <ErrorMessage />
if (!data?.length) return <EmptyState ... />
return <ConteudoReal />
```

---

## Ordem de Implementação

### Fase 1 — Fundação

- [ ] Instalar dependências faltantes
- [ ] `globals.css` com tokens OKLCH ✅
- [ ] `app/layout.tsx` com fontes + QueryProvider + Toaster ✅
- [ ] `lib/tokens.ts`
- [ ] `lib/api.ts` — Axios + interceptors
- [ ] `lib/utils.ts` — `cn()`, `formatDate()`, `formatRelative()`
- [ ] `store/auth.store.ts` — Zustand
- [ ] `hooks/useAuth.ts`
- [ ] `types/api.ts`
- [ ] `components/providers/QueryProvider.tsx`

### Fase 2 — Auth

- [ ] `services/auth.service.ts`
- [ ] `app/(marketing)/layout.tsx`
- [ ] `app/(marketing)/login/page.tsx`
- [ ] `app/(marketing)/cadastro/page.tsx`

### Fase 3 — Shell Autenticado

- [ ] `app/(app)/layout.tsx` — AuthGuard + grid
- [ ] `components/layout/Sidebar.tsx`
- [ ] `components/layout/Topbar.tsx`
- [ ] `components/layout/EmptyState.tsx`
- [ ] `app/(app)/error.tsx`

### Fase 4 — Landing Page

- [ ] `app/(marketing)/page.tsx`
- [ ] `components/landing/HeroSection.tsx`
- [ ] `components/landing/FeaturesSection.tsx`
- [ ] `components/landing/HowItWorksSection.tsx`
- [ ] `components/landing/CtaSection.tsx`

### Fase 5 — Onboarding

- [ ] `components/onboarding/WizardStepper.tsx`
- [ ] `services/company.service.ts`
- [ ] `services/organograma.service.ts`
- [ ] `hooks/useViaCep.ts`
- [ ] Etapas 1–4 com forms + validação Zod

### Fase 6 — Dashboard

- [ ] `services/job.service.ts`
- [ ] `hooks/useJobs.ts`
- [ ] `app/(app)/dashboard/page.tsx`

### Fase 7 — Vagas

- [ ] `app/(app)/vagas/page.tsx`
- [ ] `app/(app)/vagas/nova/page.tsx`
- [ ] `nova/com-ia/page.tsx` + `JdPreview.tsx`
- [ ] `nova/manual/page.tsx` + `CandidatesRepeater.tsx`
- [ ] `app/(app)/vagas/[id]/page.tsx`
- [ ] `RankingSidebar.tsx`, `CandidateAnalysis.tsx`, `ScoreNumeral.tsx`, etc.

### Fase 8 — Organograma + Chat + Config

- [ ] `app/(app)/organograma/page.tsx`
- [ ] `app/(app)/chat/page.tsx` + `hooks/useChatStream.ts`
- [ ] `app/(app)/configuracoes/page.tsx`

### Fase 9 — Portal do Candidato

- [ ] `app/teste/[token]/layout.tsx`
- [ ] Páginas do fluxo de testes (5 páginas)
- [ ] `TestProgressBar.tsx`, `DiscQuestion.tsx`, `ScaleQuestion.tsx`, `TestNav.tsx`

---

## Cortes Conscientes (MVP)

| Feature | Status |
|---|---|
| Server Actions | ❌ Sem — tudo via REST |
| NextAuth | ❌ Sem — JWT puro |
| Drag-and-drop (organograma) | ❌ Sem — formulário com Select |
| Dark mode | ❌ Stretch goal |
| i18n | ❌ Tudo PT-BR |
| Paginação | ❌ Volume baixo no MVP |
| PDF do relatório | ❌ Stretch goal |
| Notificações por e-mail | ❌ Backend já tem, front não conecta no MVP |

---

**Fim do PLANNING-FRONTEND.**
