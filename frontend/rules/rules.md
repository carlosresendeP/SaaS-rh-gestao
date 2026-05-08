# Regras de Desenvolvimento — carlosresende.com.br

> Documento de referência para desenvolvimento do site. Leia antes de escrever qualquer código.

---

## Persona & Role

Atue sempre como um **desenvolvedor senior full-stack**. Isso significa:

- Tomar decisões baseadas em boas práticas, performance e manutenibilidade
- Preferir soluções simples e diretas — complexidade só quando necessária
- Pensar em quem vai ler o código depois (você mesmo, em 6 meses)
- Não implementar nada além do que foi solicitado
- Questionar requisitos ambíguos antes de implementar
- Sempre que possível, utilize os recursos do shadcn/ui, nunca crie componentes do zero a não ser que não tenha o componente no shadcn/ui.

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Gerenciador de pacotes | npm |
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Linguagem | TypeScript (strict mode) |
| Estilização | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Ícones | lucide-react / react-icons |
| ORM | Prisma |
| Banco de dados | MongoDB |

---

## Regras Gerais

- **NUNCA** rode `npm run build` — use `npm run dev` para desenvolvimento
- Siga os princípios de **Clean Code** (Uncle Bob) em todo o código
- Faça commits pequenos e descritivos — uma mudança lógica por commit
- **Não crie arquivos desnecessários** — prefira editar os existentes
- **Não adicione features além do que foi pedido** — sem "melhorias" não solicitadas
- O código deve ser autoexplicativo — evite comentários que apenas repetem o que o código diz
- Comentários são bem-vindos apenas para explicar **por quê**, não **o quê**
- Não adicione tratamento de erros para cenários impossíveis
- Não crie abstrações prematuras — três linhas similares não justificam uma função utilitária
- Não adicione `console.log` de debug no código final

---

## TypeScript

### Tipagem

- **NUNCA** use `any` — se não sabe o tipo, descubra antes de continuar
- **NUNCA** use `unknown` sem narrowing adequado logo em seguida
- Crie tipos/interfaces específicos para cada entidade do domínio
- Prefira `interface` para shapes de objetos e `type` para unions/intersections/aliases

```typescript
// ERRADO
const processUser = (user: any) => { ... }

// CERTO
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}
const processUser = (user: User) => { ... }
```

### Generics e Utilitários

- Use `Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>` para variações de tipos existentes
- Use `Promise<Tipo>` sempre que retornar uma Promise — nunca deixe implícito

```typescript
// ERRADO
async function getUser(id: string) { ... }

// CERTO
async function getUser(id: string): Promise<User | null> { ... }
```

### Validação com Zod

- Use **Zod** para validar todos os dados externos: entradas de API, formulários, variáveis de ambiente
- Derive os tipos TypeScript dos schemas Zod — nunca duplique

```typescript
import { z } from 'zod'

const CreatePostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

type CreatePostInput = z.infer<typeof CreatePostSchema>
```

### Regras Adicionais

- Sem cast forçado com `as Tipo` — resolva o problema na tipagem
- Strict mode está habilitado no `tsconfig.json` — mantenha assim
- Tipos globais compartilhados ficam em `types/`

---

## Next.js & React

### Server vs Client Components

**Regra de decisão:**

```
O componente precisa de...?
│
├── useState, useEffect, event handlers, hooks de browser
│   └── → 'use client'
│
├── Só busca dados / renderiza conteúdo estático / sem interatividade
│   └── → Server Component (padrão)
│
└── Precisa dos dois?
    └── → Separe: Server Component pai + Client Component filho
```

- **Server Component é o padrão** — adicione `'use client'` apenas quando necessário
- Nunca faça `fetch` em Client Components — busque no Server e passe via props

### Rotas e Arquivos Especiais

Sempre crie estes arquivos nas rotas que precisarem:

| Arquivo | Propósito |
|---------|-----------|
| `page.tsx` | UI da rota |
| `layout.tsx` | Layout compartilhado |
| `loading.tsx` | Estado de carregamento (Suspense) |
| `error.tsx` | Boundary de erro |
| `not-found.tsx` | Página 404 da rota |

### Organização de Rotas

- Use **Route Groups** `(nome)` para organizar sem impactar a URL
- Exemplos: `(marketing)`, `(dashboard)`, `(auth)`

### Server Actions

- Use Server Actions para **mutations** e **submissões de formulário**
- Sempre valide os dados de entrada com Zod antes de qualquer operação

```typescript
'use server'

import { z } from 'zod'

const schema = z.object({ name: z.string().min(1) })

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') })
  if (!parsed.success) throw new Error('Dados inválidos')
  // ...
}
```

### Imagens e Metadata

- **Sempre** use `next/image` para imagens — nunca `<img>` diretamente
- Defina `priority` para imagens acima da dobra (above-the-fold)
- Use `export const metadata` para metadata estática ou `generateMetadata` para dinâmica

### Imports Dinâmicos

- Use `next/dynamic` para componentes pesados que não são necessários no carregamento inicial

```typescript
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
})
```

---

## Tailwind CSS (v4)

### Princípios

- **Mobile-first sempre**: estilos base sem prefixo, overrides com `md:`, `lg:`, etc.
- Cores definidas em OKLCH no `globals.css` via `@theme` — não use valores hardcoded
- Dark mode via classe `.dark`

```html
<!-- CERTO: mobile-first -->
<div class="w-full md:w-1/2 lg:w-1/3">

<!-- ERRADO: desktop-first -->
<div class="w-1/3 md:w-1/2 sm:w-full">
```

### Design System

- Defina tokens de design no `globals.css` com `@theme`:

```css
@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
}
```

- **Sem arbitrary values excessivos** — se usou `[valor-específico]` mais de duas vezes, vire um token

### Regras de Qualidade

- Sem `!important` — resolva especificidade corretamente
- Sem `style={}` inline — use utilities do Tailwind
- Se a mesma combinação de classes aparece **3 ou mais vezes**, extraia um componente React
- Sem `@apply` excessivo — prefira componentes a classes CSS customizadas

---

## shadcn/ui

- **Sempre** verifique se o shadcn tem o componente antes de criar um do zero
- Adicione componentes com: `npx shadcn@latest add [componente]`
- Customize via **variantes CVA** — não sobrescreva estilos inline
- `components/ui/` → apenas componentes do shadcn (não edite manualmente)
- `components/` → componentes de negócio/feature do projeto

```typescript
// CERTO: usando variante do shadcn
<Button variant="outline" size="sm">Cancelar</Button>

// ERRADO: sobrescrevendo inline
<Button className="border border-gray-300 px-2 py-1 text-xs">Cancelar</Button>
```

---

## Ícones

- Prefira **lucide-react** (já instalado) como primeira opção
- Use **react-icons** quando lucide não tiver o ícone necessário
- **NUNCA** importe a biblioteca inteira — sempre import específico

```typescript
// CERTO
import { Search, User, Settings } from 'lucide-react'

// ERRADO
import * as Icons from 'lucide-react'
```

- Defina tamanho e cor via props ou classes Tailwind

```typescript
<Search className="size-4 text-zinc-500" />
```

---

## Prisma & MongoDB

### Configuração

- Schema em `prisma/schema.prisma`
- **Singleton do PrismaClient** em `lib/prisma.ts` — nunca instancie direto nos arquivos

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Queries

- **NUNCA** faça queries brutas (`$queryRaw`) sem justificativa — use o Prisma Client
- Exceção: agregações complexas que o Prisma não suporta nativamente
- Use `prisma.$transaction` para operações atômicas (múltiplas escritas)

### Camada de Serviço

- **Nunca** acesse o Prisma diretamente em route handlers ou Server Actions
- Crie funções de serviço em `lib/services/` ou `lib/db/`

```typescript
// lib/services/user.ts
export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}

// app/api/users/[id]/route.ts — usa o serviço, não o prisma diretamente
import { getUserById } from '@/lib/services/user'
```

---

## Estrutura de Arquivos

```
interface/
├── app/                          # Rotas (Next.js App Router)
│   ├── (marketing)/              # Route group — páginas públicas
│   │   └── page.tsx
│   ├── (dashboard)/              # Route group — área autenticada
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                      # Route Handlers (API REST)
│   │   └── [resource]/
│   │       └── route.ts
│   ├── globals.css               # Estilos globais + @theme Tailwind
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── ui/                       # Componentes shadcn/ui (não editar manualmente)
│   └── [feature]/                # Componentes de negócio agrupados por feature
│
├── lib/
│   ├── prisma.ts                 # Singleton PrismaClient
│   ├── utils.ts                  # Utilitários gerais (cn, etc.)
│   └── services/                 # Funções de acesso ao banco
│
├── types/                        # Tipos TypeScript globais compartilhados
├── hooks/                        # Custom React hooks
└── prisma/
    └── schema.prisma             # Schema do banco de dados
```

---

## Nomenclatura

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componentes React | PascalCase | `UserCard.tsx`, `PostList.tsx` |
| Funções e variáveis | camelCase | `getUserById`, `isLoading` |
| Tipos e Interfaces | PascalCase | `UserProfile`, `ApiResponse<T>` |
| Constantes globais | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Arquivos de rota | kebab-case | `user-profile/page.tsx` |
| Custom hooks | prefixo `use` + camelCase | `useAuthSession`, `useDebounce` |
| Server Actions | verbo + substantivo | `createPost`, `deleteComment` |
| Schemas Zod | PascalCase + `Schema` | `CreatePostSchema`, `LoginSchema` |

---

## Performance

- Use **Suspense boundaries** para streaming de dados — não bloqueie a renderização
- Use **`Promise.all`** para buscar dados independentes em paralelo

```typescript
// CERTO: paralelo
const [user, posts] = await Promise.all([getUser(id), getPostsByUser(id)])

// ERRADO: sequencial desnecessário
const user = await getUser(id)
const posts = await getPostsByUser(id)
```

- Use **`React.cache()`** para deduplicar fetches dentro do mesmo request
- Use **`next/dynamic`** para heavy components (gráficos, editores, etc.)
- Defina `priority` no `next/image` para imagens above-the-fold

---

## Segurança

- **NUNCA** exponha variáveis de ambiente sensíveis para o cliente
  - Variáveis sem prefixo `NEXT_PUBLIC_` ficam apenas no servidor
  - Secrets (tokens, chaves) **nunca** no código — sempre em `.env.local`
- **Valide toda entrada do usuário** com Zod antes de processar
- **Sanitize dados** antes de salvar no banco (especialmente strings livres)
- Não confie em dados vindos do cliente — valide sempre no servidor
- Route Handlers e Server Actions devem validar autenticação/autorização antes de operar

---

> Última atualização: 2026-03-27
