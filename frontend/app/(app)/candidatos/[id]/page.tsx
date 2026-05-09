"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Mail,
  Phone,
  Download,
  Zap,
  FlaskConical,
  CheckCircle2,
  Circle,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Link,
} from "lucide-react"


import { toast } from "sonner"
import { applicationService } from "@/services/application.service"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus, DiscScores } from "@/types/api"

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDENTE:           "Pendente",
  EM_ANALISE:         "Em Análise",
  TESTE_PSICOMETRICO: "Teste Psicométrico",
  ENTREVISTA:         "Entrevista",
  APROVADO:           "Aprovado",
  REPROVADO:          "Reprovado",
}

const STATUS_ORDER: ApplicationStatus[] = [
  "PENDENTE",
  "EM_ANALISE",
  "TESTE_PSICOMETRICO",
  "ENTREVISTA",
  "APROVADO",
]

const JOURNEY_LABELS: Record<string, string> = {
  PENDENTE:           "Candidatura recebida",
  EM_ANALISE:         "Triagem com IA",
  TESTE_PSICOMETRICO: "Teste psicométrico",
  ENTREVISTA:         "Entrevista",
  APROVADO:           "Aprovado",
}

const DISC_LABELS: Record<keyof Omit<DiscScores, "primary">, string> = {
  dominance:         "D",
  influence:         "I",
  steadiness:        "S",
  conscientiousness: "C",
}

// ── Circular progress ─────────────────────────────────────────────────────────

function CircularScore({ score }: { score: number }) {
  const r = 45
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)
  return (
    <div className="relative size-24 flex items-center justify-center shrink-0">
      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-primary-foreground">{score}%</span>
    </div>
  )
}

// ── DISC bars ─────────────────────────────────────────────────────────────────

function DiscBars({ disc }: { disc: DiscScores }) {
  const bars = (["dominance", "influence", "steadiness", "conscientiousness"] as const).map(
    (key) => ({ label: DISC_LABELS[key], value: disc[key] })
  )
  return (
    <div className="space-y-2">
      {bars.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-xs font-bold w-4 text-muted-foreground">{label}</span>
          <div className="flex-1 h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
        </div>
      ))}
    </div>
  )
}

// ── Journey timeline ──────────────────────────────────────────────────────────

function JourneyTimeline({ app }: { app: Application }) {
  const currentIdx = app.status === "REPROVADO"
    ? -1
    : STATUS_ORDER.indexOf(app.status)

  return (
    <div className="space-y-0">
      {app.status === "REPROVADO" && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2 text-sm text-destructive font-medium">
          Candidatura encerrada — Reprovado
        </div>
      )}
      <div className="relative border-l-2 border-secondary/30 ml-4 space-y-6 pb-2">
        {STATUS_ORDER.map((status, i) => {
          const done    = i < currentIdx || (i === currentIdx && status !== "APROVADO")
          const active  = i === currentIdx
          const future  = i > currentIdx

          return (
            <div key={status} className="relative pl-7">
              <div
                className={cn(
                  "absolute -left-[9px] top-0.5 size-4 rounded-full border-2",
                  done   && "bg-primary border-primary",
                  active && "size-5 -left-[11px] bg-primary border-4 border-background shadow-[0_0_0_2px_hsl(var(--primary))]",
                  future && "bg-muted border-secondary/50",
                  app.status === "REPROVADO" && "bg-muted border-secondary/50"
                )}
              />
              <div className={cn("flex items-start justify-between gap-2", future && "opacity-40")}>
                <div>
                  <p className={cn(
                    "text-sm font-semibold",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {JOURNEY_LABELS[status]}
                  </p>
                  {status === "EM_ANALISE" && app.matchScore && (
                    <p className="text-xs text-muted-foreground">
                      Score calculado: {app.matchScore}%
                    </p>
                  )}
                  {status === "TESTE_PSICOMETRICO" && app.candidate?.testCompletedAt && (
                    <p className="text-xs text-muted-foreground">
                      Concluído em {app.candidate.testCompletedAt}
                    </p>
                  )}
                </div>
                {done && (
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                )}
                {active && !done && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide shrink-0">
                    Atual
                  </span>
                )}
                {future && (
                  <Circle className="size-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CandidatoProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [testLink, setTestLink] = useState<string | null>(null)
  const [copied, setCopied]     = useState(false)

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", "company"],
    queryFn: applicationService.listByCompany,
  })

  const app = applications?.find((a) => a.id === id)

  const { mutate: moveStatus, isPending: movingStatus } = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "company"] })
      toast.success("Status atualizado")
    },
  })

  const { mutate: generateLink, isPending: generatingLink } = useMutation({
    mutationFn: () => applicationService.createTestLink(id),
    onSuccess: ({ url }) => {
      setTestLink(url)
      navigator.clipboard.writeText(url).catch(() => null)
      toast.success("Link de teste gerado e copiado!")
    },
    onError: () => toast.error("Erro ao gerar link de teste."),
  })

  function handleCopyLink() {
    if (!testLink) return
    navigator.clipboard.writeText(testLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4 space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <div className="col-span-8 space-y-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Candidatura não encontrada.</p>
        <Button variant="link" onClick={() => router.back()}>Voltar</Button>
      </div>
    )
  }

  const candidate  = app.candidate
  const disc       = candidate?.respostasJson?.disc ?? null
  const eneagrama  = candidate?.respostasJson?.eneagrama ?? null
  const personalit = candidate?.respostasJson?.personalities ?? null
  const report     = app.matchResultJson
  const hasTest    = !!candidate?.testCompletedAt

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{candidate?.nome ?? "Candidato"}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {(app.job as { titulo?: string } | undefined)?.titulo ?? "Vaga"} • {STATUS_LABELS[app.status]}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Move status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={movingStatus} size="sm">
                {movingStatus ? <Loader2 className="size-3.5 mr-1.5 animate-spin" /> : null}
                {STATUS_LABELS[app.status]}
                <ChevronDown className="size-3.5 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(STATUS_LABELS) as ApplicationStatus[])
                .filter((s) => s !== app.status)
                .map((s) => (
                  <DropdownMenuItem key={s} onClick={() => moveStatus(s)}>
                    {STATUS_LABELS[s]}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ver vaga */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/vagas/${app.jobId}`)}
          >
            <ExternalLink className="size-3.5 mr-1.5" />
            Ver Vaga
          </Button>

          {/* Test link */}
          {testLink ? (
            <Button size="sm" variant="outline" onClick={handleCopyLink}>
              {copied ? <Check className="size-3.5 mr-1.5" /> : <Copy className="size-3.5 mr-1.5" />}
              {copied ? "Copiado!" : "Copiar link"}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={generatingLink}
              onClick={() => generateLink()}
            >
              {generatingLink
                ? <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                : <FlaskConical className="size-3.5 mr-1.5" />}
              Gerar Link de Teste
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-12 gap-5">

        {/* ── Left column ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

          {/* Profile card */}
          <div className="rounded-xl border border-secondary/40 bg-card p-5 space-y-4">
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-secondary/20">
              <div className="size-20 rounded-full bg-sidebar text-sidebar-foreground font-bold text-2xl flex items-center justify-center mb-3">
                {candidate?.nome?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?"}
              </div>
              <h2 className="text-lg font-bold">{candidate?.nome}</h2>
              <span
                className={cn(
                  "mt-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                  app.status === "APROVADO"
                    ? "bg-green-500/10 border-green-500/40 text-green-600"
                    : app.status === "REPROVADO"
                    ? "bg-destructive/10 border-destructive/40 text-destructive"
                    : "bg-primary/10 border-primary/40 text-primary"
                )}
              >
                {STATUS_LABELS[app.status]}
              </span>
            </div>

            {/* Contact info */}
            <div className="space-y-2">
              {candidate?.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
              )}
              {candidate?.telefone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-3.5 shrink-0" />
                  <span>{candidate.telefone}</span>
                </div>
              )}
              {candidate?.linkedinUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Link className="size-3.5 shrink-0 text-[#0A66C2]" />
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] hover:underline truncate"
                  >
                    Ver LinkedIn
                  </a>
                </div>
              )}
            </div>

            {/* Download CV PDF */}
            {candidate?.curriculoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(candidate.curriculoUrl!, "_blank")}
              >
                <Download className="size-3.5 mr-1.5" />
                Baixar Currículo PDF
              </Button>
            )}
          </div>

          {/* Behavioral profile */}
          <div className="rounded-xl border border-secondary/40 bg-card p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Perfil Comportamental
            </p>

            {!hasTest ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Teste psicométrico ainda não realizado.
              </p>
            ) : (
              <>
                {disc && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground">DISC</p>
                    <DiscBars disc={disc} />
                    <p className="text-xs text-muted-foreground">
                      Perfil dominante:{" "}
                      <span className="font-bold text-primary uppercase">{disc.primary}</span>
                    </p>
                  </div>
                )}

                {eneagrama && (
                  <div className="border-t border-secondary/20 pt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Eneagrama</span>
                    <span className="text-xs font-bold bg-sidebar/10 text-foreground border border-secondary/40 px-2 py-0.5 rounded-full">
                      Tipo {eneagrama.primaryType}
                    </span>
                  </div>
                )}

                {personalit && (
                  <div className="border-t border-secondary/20 pt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">16 Personalidades</span>
                    <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                      {personalit.type}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">

          {/* Match score banner */}
          {app.matchScore !== null && app.matchScore !== undefined ? (
            <div className="rounded-xl bg-sidebar p-5 flex items-center justify-between gap-4 overflow-hidden relative">
              <div className="absolute -right-8 -top-8 size-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="z-10">
                <h3 className="text-lg font-bold text-sidebar-foreground">Score de Alinhamento</h3>
                <p className="text-sm text-sidebar-foreground/70 mt-0.5">
                  Análise combinada de skills técnicas e fit cultural.
                </p>
              </div>
              <CircularScore score={app.matchScore} />
            </div>
          ) : (
            <div className="rounded-xl border border-secondary/40 bg-muted/30 p-5 flex items-center gap-3 text-muted-foreground">
              <Zap className="size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Análise IA não gerada</p>
                <p className="text-xs">Acesse a vaga e clique em Gerar Análise com IA para calcular o score.</p>
              </div>
            </div>
          )}

          {/* AI analysis */}
          {report && (
            <div className="rounded-xl border border-secondary/40 bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-secondary/20 bg-muted/30">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Análise Detalhada da IA
                </p>
              </div>
              <div className="p-5 space-y-4">
                {report.resumoExecutivo && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.resumoExecutivo}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.pontosFortes?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                        <span className="size-2 rounded-full bg-primary inline-block" />
                        Pontos Fortes
                      </p>
                      <ul className="space-y-1.5">
                        {report.pontosFortes.map((p, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            • {p.titulo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.pontosAtencao?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                        <span className="size-2 rounded-full bg-yellow-500 inline-block" />
                        Pontos de Atenção
                      </p>
                      <ul className="space-y-1.5">
                        {report.pontosAtencao.map((p, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            • {p.titulo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Journey timeline */}
          <div className="rounded-xl border border-secondary/40 bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
              Jornada do Candidato
            </p>
            <JourneyTimeline app={app} />
          </div>

        </div>
      </div>
    </div>
  )
}
