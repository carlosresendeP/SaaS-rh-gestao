// ─── Enums — espelham exatamente os enums do schema.prisma ───────────────────

export type JobStatus = "ABERTA" | "FECHADA" | "PAUSADA"

export type ApplicationStatus =
  | "PENDENTE"
  | "EM_ANALISE"
  | "TESTE_PSICOMETRICO"
  | "ENTREVISTA"
  | "APROVADO"
  | "REPROVADO"

// ─── Wrapper padrão da API ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  error: string
  fieldErrors?: Record<string, string[]>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  companyId: string
  nome: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nome: string
  email: string
  password: string
  razaoSocial: string
  cnpj: string
}

// ─── Company — modelo: Company ────────────────────────────────────────────────

export interface Company {
  id: string
  nome: string | null
  razaoSocial: string
  cnpj: string
  onboardingStep: number
  contextoEmpresa: string | null
  perfilRitmo: string | null
  valores: string[]
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateCompanyRequest {
  nome?: string
  razaoSocial?: string
  contextoEmpresa?: string
  perfilRitmo?: string
  valores?: string[]
  logoUrl?: string
}

// ─── OrganogramaNode — modelo: OrganogramaNode ────────────────────────────────

export interface OrganogramaNode {
  id: string
  nome: string
  cargo: string
  parentId: string | null
  companyId: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganogramaNodeRequest {
  nome: string
  cargo: string
  parentId?: string | null
}

// ─── Job — modelo: Job ───────────────────────────────────────────────────────

export interface Job {
  id: string
  titulo: string
  descricao: string | null
  requisitos: string | null
  salario: string | null
  status: JobStatus
  liderId: string | null
  jdGerada: string | null
  perfilIdealJson: unknown
  publicToken: string | null
  salaryMin: string | null
  salaryMax: string | null
  companyId: string
  createdAt: string
  updatedAt: string
  lider?: Pick<OrganogramaNode, "id" | "nome" | "cargo"> | null
  _count?: { applications: number }
}

export interface CreateJobRequest {
  titulo: string
  descricao?: string
  requisitos?: string
  salaryMin?: number
  salaryMax?: number
  status?: JobStatus
  liderId?: string
}

export type UpdateJobRequest = Partial<CreateJobRequest>

// ─── Candidate — modelo: Candidate ───────────────────────────────────────────

export interface DiscScores {
  dominance: number
  influence: number
  steadiness: number
  conscientiousness: number
  primary: string
}

export interface EneagramaScores {
  scores: Record<string, number>
  primaryType: number
}

export interface PersonalitiesScore {
  type: string
  scores: Record<string, number>
}

export interface RespostasJson {
  disc?: DiscScores | null
  eneagrama?: EneagramaScores | null
  personalities?: PersonalitiesScore | null
}

export interface Candidate {
  id: string
  nome: string
  email: string
  telefone: string | null
  curriculoUrl: string | null
  testCompletedAt: string | null
  respostasJson?: RespostasJson | null
  createdAt: string
  updatedAt: string
  personality?: PersonalityResult
}

export interface ApplyRequest {
  jobId: string
  nome: string
  email: string
  telefone?: string
  curriculoUrl?: string
}

// ─── PersonalityResult — modelo: PersonalityResult ───────────────────────────

export interface PersonalityResult {
  id: string
  candidateId: string
  disc: string | null
  eneagrama: string | null
  rawScore: unknown
  createdAt: string
  updatedAt: string
}

// ─── Application — modelo: Application ───────────────────────────────────────

export interface Application {
  id: string
  status: ApplicationStatus
  feedbackIA: string | null
  matchScore: number | null
  matchResultJson: MatchReport | null
  jobId: string
  candidateId: string
  companyId: string
  createdAt: string
  updatedAt: string
  job?: Pick<Job, "id" | "titulo" | "status">
  candidate?: Candidate
}

// ─── TestLink — modelo: TestLink ─────────────────────────────────────────────

export interface TestLink {
  id: string
  token: string
  applicationId: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

// ─── Match Report — estrutura do JSON gerado pela IA ─────────────────────────
// Armazenado em Application.matchResultJson

export interface MatchReport {
  candidateId: string
  nome: string
  rankingPosition: number
  matchScore: number
  resumoExecutivo: string
  pontosFortes: PontoForte[]
  pontosAtencao: PontoAtencao[]
  comoLiderarEsseCandidato: ComoLiderar
  matchComCultura: MatchCultura
  perguntasComplementares: string[]
  desafioPratico: DesafioPratico
}

export interface PontoForte {
  titulo: string
  descricao: string
  impactoNaFuncao: string
}

export interface PontoAtencao {
  titulo: string
  descricao: string
  sugestaoDeDesenvolvimento: string
}

export interface ComoLiderar {
  delegacao: string
  feedback: string
  motivacao: string
}

export interface MatchCultura {
  onde: string
  fricaoEsperada: string
}

export interface DesafioPratico {
  titulo: string
  descricao: string
  duracaoEstimada: string
  habilidadesAvaliadas: string[]
}

// ─── Teste Psicométrico — portal público /teste/[token] ──────────────────────

type DiscValue = "D" | "I" | "S" | "C"
type PersonalityValue = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"

export type { DiscValue, PersonalityValue }

export interface DiscOption { value: DiscValue; text: string }
export interface DiscQuestion { id: string; text: string; options: DiscOption[] }

export interface EneagramaOption { value: number; text: string }
export interface EneagramaQuestion { id: string; text: string; options: EneagramaOption[] }

export interface PersonalityOption { value: PersonalityValue; text: string }
export interface PersonalityQuestion { id: string; text: string; options: PersonalityOption[] }

export interface TestQuestions {
  disc: DiscQuestion[]
  eneagrama: EneagramaQuestion[]
  personalities: PersonalityQuestion[]
}

export interface TestData {
  candidate: string
  expiresAt: string
  questions: TestQuestions
}

export interface TestSubmitRequest {
  disc?: Record<string, DiscValue>
  eneagrama?: Record<string, number>
  personalities?: Record<string, PersonalityValue>
}
