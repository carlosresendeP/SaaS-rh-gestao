# ⚙️ SaaS-RH - Backend API

Esta é a documentação exclusiva do **Backend** do SaaS-RH. O serviço foi construído como uma API RESTful de altíssima performance, sendo o núcleo do sistema responsável por gerir toda a lógica de recrutamento, análise de currículos por IA (Inteligência Artificial), segurança e armazenamento de dados.


---

## 🎯 Sobre o Backend

O backend opera de forma independente do frontend (desacoplado) e fornece uma gama de APIs seguras. O principal diferencial deste serviço é a integração nativa com o ecossistema de Inteligência Artificial para ler arquivos PDF (currículos), extrair informações vitais e comparar o perfil do candidato com a descrição de uma vaga gerada pela empresa.

### 🔄 Fluxo da Arquitetura API

```mermaid
graph TD
    A[Client Request HTTP] --> B[Fastify Router]
    B --> C{Autenticado via JWT?}
    C -->|Não| D[401 Unauthorized]
    C -->|Sim / Rota Pública| E[Zod Type Provider Valida Schema]
    E -->|Erro de Tipagem| F[400 Bad Request]
    E -->|Sucesso| G[Controller da Entidade]
    G --> H[Service Layer]
    H --> I[Prisma ORM / PostgreSQL]
    H --> J[AI SDK / Resend / File System]
    I --> K[Formata DTO]
    J --> K
    K --> L[Response 20X JSON]
```

**Resumo do Fluxo:**
1. 📡 **Requisição**: O frontend (ou qualquer cliente HTTP) envia o request.
2. 🔒 **Middleware / Hooks**: O Fastify verifica tokens JWT para rotas protegidas (ex: Criação de vaga).
3. 🛡️ **Validação (Type Provider)**: O esquema Zod intercepta o `body`, `query` ou `params` e recusa automaticamente tipos errados (ex: string no lugar de number).
4. 🧠 **Lógica de Negócios**: O `Controller` passa os dados limpos para o `Service`, que pode chamar o `Prisma` para o Banco de Dados ou o `AI SDK` para processos pesados de linguagem natural.
5. 📤 **Resposta**: O servidor devolve um JSON padronizado.

---

## ✨ Funcionalidades do Motor Backend

- ✅ **Geração de Conteúdo IA**: Endpoints capazes de estruturar descrições perfeitas de vagas com base em prompts curtos do usuário.
- ✅ **Análise Curricular Automática**: Recebimento de PDFs (multipart/form-data), conversão para texto e geração de "Match Score" através de IA.
- ✅ **Comunicação por E-mail**: Integração com Resend para envio de e-mails transacionais (convites, alertas, recuperações).
- ✅ **Segurança em Primeiro Lugar**: Hash de senhas unidirecional (bcryptjs), proteção contra vulnerabilidades HTTP (`@fastify/helmet`) e gestão rigorosa de CORS.
- ✅ **Links Públicos**: Geração de tokens únicos atrelados a vagas para inscrição de candidatos sem necessidade de conta (Public Token).

---

## 🚀 Tecnologias Utilizadas

- **[Fastify 5.x](https://fastify.dev/)** - Framework web Node.js extremamente rápido.
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem fortemente tipada para segurança em tempo de compilação.
- **[Prisma ORM](https://www.prisma.io/)** - Mapeamento objeto-relacional (ORM) e modelagem do banco.
- **[PostgreSQL](https://www.postgresql.org/)** - Sistema de banco de dados relacional.
- **[Zod](https://zod.dev/)** - Declaração de esquemas e validação de dados.
- **[fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)** - Integra as tipagens Zod diretamente nos ciclos de vida das rotas do Fastify.
- **[AI SDK (Vercel)](https://sdk.vercel.ai/docs)** - Bibliotecas unificadas para acessar a API da OpenAI e Anthropic.
- **[Resend](https://resend.com/)** - Serviço moderno de entrega de e-mails transacionais.
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** & **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Criptografia e Autenticação.

---

## 📦 Pré-requisitos

Para rodar a API de desenvolvimento, você precisa de:

- **[Node.js](https://nodejs.org/)** (v20+)
- **[pnpm](https://pnpm.io/)** (Gerenciador de pacotes)
- Banco de Dados **PostgreSQL** rodando (local ou nuvem como Supabase)
- Obter chaves de API nos portais da **OpenAI** (ou Anthropic) e do **Resend**.

---

## ⚙️ Instalação e Configuração

### 1. Instale as Dependências

Acesse a pasta `Backend` e rode:

```bash
cd Backend
pnpm install
```

### 2. Configure as Variáveis de Ambiente

Copie o modelo de arquivo de ambiente e preencha com seus dados reais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3001
NODE_ENV=dev
DATABASE_URL="postgresql://user:pass@localhost:5432/saas_rh"
JWT_SECRET="sua_chave_ultra_secreta_jwt"
APP_URL=http://localhost:3001/api

# Chaves de integrações IA e E-mail
OPENAI_API_KEY="sk-..."
RESEND_API_KEY="re_..."
EMAIL_FROM=onboarding@resend.dev
```

### 3. Configure o Banco e o Prisma

Com a `DATABASE_URL` corretamente configurada, execute a sincronização:

```bash
# Cria tabelas baseadas no prisma/schema.prisma
npx prisma migrate dev

# Gera as tipagens seguras do Prisma Client para o TypeScript
npx prisma generate
```

---

## 🎮 Como Rodar o Projeto

### Modo Desenvolvimento (Hot-reload)

Utiliza o `tsx` para compilar sob demanda e reiniciar ao salvar alterações.

```bash
pnpm dev
```
A API estará em execução em: `http://localhost:3001` (ou na porta definida no `.env`).

### Modo Produção

Para publicar em um provedor (Render, VPS, Docker):

```bash
# Transpila os arquivos TypeScript para CJS (.js) na pasta /dist
pnpm build

# Inicia o servidor Node original
pnpm start
```

### Acessar Banco de Dados Visualmente

O Prisma oferece uma interface gráfica nativa para você ler/editar tabelas (Empresas, Vagas, Candidatos, etc).

```bash
npx prisma studio
```
Irá abrir no navegador: `http://localhost:5555`.

---

## 📁 Estrutura do Diretório

Organização modular para favorecer manutenção em longo prazo.

```
Backend/
├── prisma/                      # Definições do banco de dados
│   ├── migrations/              # Histórico SQL das tabelas
│   └── schema.prisma            # Modelagem das entidades
├── src/
│   ├── Ai/                      # Integração com Modelos Generativos
│   │   ├── Anthropic.ts         # Wrapper Anthropic
│   │   └── OpenAi.ts            # Wrapper OpenAI
│   ├── config/                  # Definições base (ex: CORS, plugins)
│   ├── controllers/             # Onde as requisições HTTP chegam e são respondidas
│   ├── middleware/              # Funções injetáveis (Autenticação JWT, check de admin)
│   ├── Routes/                  # Cada arquivo agrupa verbos (GET, POST) de um domínio
│   ├── schemas/                 # Tipos/Zod (Validação rígida de Inputs e Outputs)
│   ├── services/                # Regras de Negócio e queries no banco Prisma
│   ├── app.ts                   # Registro de rotas e plugins na instância do Fastify
│   └── server.ts                # Inicializador de conexões e porta listener
├── uploads/                     # Diretório temporário para guardar currículos PDFs recebidos
├── package.json
└── tsconfig.json
```

---

## 🔌 Endpoints Principais

Abaixo estão as rotas centrais da API. (Prefixo `/api`)

### Autenticação (`/auth`)
- `POST /auth/login` → Autentica gestor, retorna os dados e o token JWT.
- `POST /auth/register` → Cria uma nova empresa e um super-admin atrelado.

### Vagas (`/vagas`)
- `POST /vagas` → *(Auth)* Cria nova vaga atrelada à empresa logada.
- `GET /vagas` → *(Auth)* Lista vagas do sistema da empresa.
- `GET /vagas/:id` → *(Auth)* Detalhes de uma vaga por ID.
- `POST /vagas/ai/generate` → *(Auth)* Gera um texto rico de descrição usando a IA baseada em um título e instruções.

### Candidatos (`/candidatos`)
- `GET /candidatos/public-token/:token` → Rota Pública que valida se um link de inscrição está válido, retornando os detalhes da vaga ao Front.
- `POST /candidatos` → Rota Pública para candidaturas (Multipart Form Data para envio de arquivo PDF).
- `POST /candidatos/analyze/:id` → *(Auth)* Manda a IA ler o PDF do candidato `:id` e gerar o *score* contra os requisitos da vaga.

### Notificações (`/emails`)
- `POST /emails/send` → Dispara requisição direta via SDK do Resend para caixas de entrada.

---

## 🔐 Variáveis de Ambiente do Backend

| Variável | Descrição | Obrigatória | Exemplo |
|----------|-----------|-------------|---------|
| `PORT` | Porta de acesso API | ✅ Sim | `3001` |
| `NODE_ENV` | Modo de ambiente | ✅ Sim | `dev` ou `production` |
| `DATABASE_URL` | String de Conexão com PG | ✅ Sim | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Chave única para assinar tokens | ✅ Sim | `MinhaSuperSenhaSecreta` |
| `APP_URL` | URL base que será retornada ou usada em webhooks | ✅ Sim | `http://localhost:3001/api` |
| `OPENAI_API_KEY`| Token gerado no dashboard OpenAI | ❌ Não | `sk-proj-...` |
| `RESEND_API_KEY`| Token do portal Resend | ❌ Não | `re_...` |
| `EMAIL_FROM` | E-mail registrado no Resend para enviar mensagens | ❌ Não | `onboarding@resend.dev` |

---

## 🛠️ Scripts Disponíveis

Na pasta `Backend`, utilize o **pnpm** para as ações.

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Executa o servidor TypeScript em desenvolvimento com restart automático. |
| `pnpm build` | Compila o projeto (usando tsup) exportando para a pasta `dist/`. |
| `pnpm start` | Inicia o projeto já buildado em ambiente de produção. |

---

## 👨💻 Autor

**Carlos Paula**

---

**Versão API**: 1.0.0  
**Status**: Estável / Produção-Ready
