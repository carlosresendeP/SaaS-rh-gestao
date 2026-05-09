"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  Briefcase, Users, MessageSquare, CheckCircle2,
  TrendingUp, Clock, AlertTriangle, Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { companyService } from "@/services/company.service"
import { useJobs } from "@/hooks/useJobs"
import { useCompanyApplications } from "@/hooks/useApplications"
import type { ApplicationStatus } from "@/types/api"

// ── Helpers ───────────────────────────────────────────────────────────────────

function isThisMonth(dateStr: string): boolean {
  const parts = dateStr.split("/")
  if (parts.length < 3) return false
  const month = parseInt(parts[1], 10)
  const year  = parseInt(parts[2].split(" ")[0], 10)
  const now   = new Date()
  return month === now.getMonth() + 1 && year === now.getFullYear()
}

function getInitials(name?: string): string {
  if (!name) return "?"
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("")
}

// "2025-05-05" → "05/05"
function fmtWeek(iso: string): string {
  const [, m, d] = iso.split("-")
  return `${d}/${m}`
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  PENDENTE:           { label: "PENDENTE",   className: "bg-muted text-foreground border-border" },
  EM_ANALISE:         { label: "EM ANÁLISE", className: "bg-muted text-foreground border-border" },
  TESTE_PSICOMETRICO: { label: "TESTE",      className: "bg-accent/20 text-foreground border-accent/40" },
  ENTREVISTA:         { label: "ENTREVISTA", className: "bg-primary/20 text-foreground border-primary/40" },
  APROVADO:           { label: "APROVADO",   className: "bg-sidebar text-sidebar-foreground border-sidebar" },
  REPROVADO:          { label: "REPROVADO",  className: "bg-destructive/20 text-foreground border-destructive/40" },
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────

function Sparkline({ data }: { data: { semana: string; count: number }[] }) {
  if (data.length === 0) return null
  const max   = Math.max(...data.map((d) => d.count), 1)
  const W     = 300
  const H     = 60
  const step  = W / (data.length - 1)

  const points = data.map((d, i) => {
    const x = i * step
    const y = H - (d.count / max) * (H - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(" ")

  const areaPoints = [
    `0,${H}`,
    ...data.map((d, i) => {
      const x = i * step
      const y = H - (d.count / max) * (H - 8)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }),
    `${W},${H}`,
  ].join(" ")

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14 overflow-visible">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="hsl(var(--sidebar))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--sidebar))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#sparkGrad)" />
        <polyline
          points={points}
          fill="none"
          stroke="hsl(var(--sidebar))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i * step).toFixed(1)}
            cy={(H - (d.count / max) * (H - 8)).toFixed(1)}
            r="3"
            fill="hsl(var(--sidebar))"
          />
        ))}
      </svg>
      <div className="flex justify-between">
        {data.map((d) => (
          <span key={d.semana} className="text-[10px] text-muted-foreground">{fmtWeek(d.semana)}</span>
        ))}
      </div>
    </div>
  )
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()

  const { data: company }                            = useQuery({ queryKey: ["company"], queryFn: companyService.get })
  const { data: jobs        = [], isLoading: jobsL } = useJobs()
  const { data: applications = [], isLoading: appsL } = useCompanyApplications()
  const { data: stats, isLoading: statsL }           = useQuery({
    queryKey: ["company-stats"],
    queryFn: companyService.getStats,
  })

  useEffect(() => {
    if (company && company.onboardingStep < 5) {
      router.replace(`/onboarding/etapa-${Math.min(company.onboardingStep, 4)}`)
    }
  }, [company, router])

  if (jobsL || appsL || statsL) return <DashboardSkeleton />

  // ── KPIs ──
  const vagasAbertas     = jobs.filter((j) => j.status === "ABERTA").length
  const candidatosAtivos = applications.filter((a) => a.status !== "REPROVADO").length
  const emEntrevista     = applications.filter((a) => a.status === "ENTREVISTA").length
  const aprovadosMes     = applications.filter(
    (a) => a.status === "APROVADO" && isThisMonth(a.createdAt)
  ).length

  const kpis = [
    {
      label: "VAGAS ABERTAS",
      value: vagasAbertas,
      icon: Briefcase,
      trend: { icon: TrendingUp, text: `${jobs.length} vagas no total` },
    },
    {
      label: "CANDIDATOS ATIVOS",
      value: candidatosAtivos,
      icon: Users,
      trend: { icon: TrendingUp, text: `${applications.length} candidaturas` },
    },
    {
      label: "EM ENTREVISTA",
      value: emEntrevista,
      icon: MessageSquare,
      trend: { icon: Clock, text: "na fase de entrevista" },
    },
    {
      label: "APROVADOS ESTE MÊS",
      value: aprovadosMes,
      icon: CheckCircle2,
      trend: {
        icon: Clock,
        text: stats?.tempoMedioContratacao != null
          ? `tempo médio: ${stats.tempoMedioContratacao}d`
          : `${applications.filter((a) => a.status === "APROVADO").length} no total`,
      },
    },
  ]

  // ── Funnel com % de conversão ──
  const total = applications.length
  const count = (statuses: ApplicationStatus[]) =>
    applications.filter((a) => statuses.includes(a.status)).length

  const funnelStages = [
    { label: "Triagem",       qty: total,                                                         },
    { label: "Em Análise",    qty: count(["EM_ANALISE","TESTE_PSICOMETRICO","ENTREVISTA","APROVADO"]) },
    { label: "Teste",         qty: count(["TESTE_PSICOMETRICO","ENTREVISTA","APROVADO"])           },
    { label: "Entrevista",    qty: count(["ENTREVISTA","APROVADO"])                                },
    { label: "Oferta",        qty: count(["APROVADO"])                                             },
  ].map((s, i, arr) => ({
    ...s,
    pct:  total > 0 ? Math.max(Math.round((s.qty / total) * 100), s.qty > 0 ? 4 : 0) : 0,
    conv: i > 0 && arr[i - 1].qty > 0
      ? Math.round((s.qty / arr[i - 1].qty) * 100)
      : null,
  }))

  const recentActivity = applications.slice(0, 5)

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon      = kpi.icon
          const TrendIcon = kpi.trend.icon
          return (
            <Card key={kpi.label} className="border-secondary/40 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground tabular-nums">
                      {String(kpi.value).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-sidebar" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendIcon className="size-3.5 shrink-0" />
                  {kpi.trend.text}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Funil + Atividade ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Funil de Recrutamento — Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            {total === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Nenhuma candidatura ainda.</p>
            ) : (
              <div className="flex flex-col gap-3 py-4">
                {funnelStages.map((stage) => (
                  <div key={stage.label} className="relative h-12 flex items-center w-full group">
                    <div className="absolute left-0 h-full w-full rounded-r-full bg-secondary/20" />
                    <div
                      className={cn(
                        "absolute left-0 h-full rounded-r-full flex items-center px-4 transition-all",
                        stage.label === "Oferta"
                          ? "bg-primary"
                          : "bg-sidebar group-hover:bg-sidebar-accent"
                      )}
                      style={{ width: `${stage.pct}%` }}
                    >
                      <span className={cn(
                        "font-bold text-sm w-28 truncate",
                        stage.label === "Oferta" ? "text-primary-foreground" : "text-sidebar-foreground"
                      )}>
                        {stage.label}
                      </span>
                      <span className={cn(
                        "ml-auto font-bold text-lg tabular-nums",
                        stage.label === "Oferta" ? "text-primary-foreground" : "text-sidebar-foreground"
                      )}>
                        {stage.qty}
                      </span>
                    </div>
                    {stage.conv !== null && (
                      <span className="absolute right-2 text-[10px] text-muted-foreground font-medium">
                        {stage.conv}% conv.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary/40 shadow-sm flex flex-col">
          <CardHeader className="pb-0 flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-4 px-3 pb-3 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma atividade ainda.</p>
            ) : (
              <div className="flex flex-col">
                {recentActivity.map((app) => {
                  const cfg  = statusConfig[app.status]
                  const name = app.candidate?.nome
                  const role = app.job?.titulo
                  return (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 py-3 border-b border-secondary/20 last:border-0 hover:bg-muted/50 transition-colors rounded-lg px-2"
                    >
                      <Avatar className="size-9 shrink-0">
                        <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground truncate">{role ?? "—"}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] font-bold whitespace-nowrap", cfg.className)}>
                        {cfg.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Analytics Row ── */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Sparkline */}
          <Card className="border-secondary/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
                Candidaturas por Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.candidaturasPorSemana.every((d) => d.count === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sem dados nas últimas 8 semanas.</p>
              ) : (
                <>
                  <p className="text-3xl font-bold tabular-nums mb-4">
                    {stats.candidaturasPorSemana.reduce((s, d) => s + d.count, 0)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">últimas 8 semanas</span>
                  </p>
                  <Sparkline data={stats.candidaturasPorSemana} />
                </>
              )}
            </CardContent>
          </Card>

          {/* Top vagas */}
          <Card className="border-secondary/40 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="size-3.5 text-sidebar" />
                <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
                  Top Vagas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {stats.topVagas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhuma vaga com candidatos ainda.</p>
              ) : (
                <div className="space-y-3">
                  {stats.topVagas.map((v, i) => (
                    <div key={v.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{v.titulo}</p>
                        <div className="h-1.5 rounded-full bg-secondary/30 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-sidebar rounded-full"
                            style={{ width: `${Math.round((v.count / stats.topVagas[0].count) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-sidebar">{v.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vagas sem candidatos */}
          <Card className={cn(
            "border-secondary/40 shadow-sm",
            stats.vagasSemCandidatos.length > 0 && "border-yellow-500/40 bg-yellow-500/5"
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn(
                  "size-3.5",
                  stats.vagasSemCandidatos.length > 0 ? "text-yellow-600" : "text-muted-foreground"
                )} />
                <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
                  Vagas Sem Movimento
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {stats.vagasSemCandidatos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Todas as vagas receberam candidatos recentemente.
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.vagasSemCandidatos.slice(0, 4).map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate flex-1">{v.titulo}</p>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-[10px] font-bold border-yellow-500/40 text-yellow-700 bg-yellow-500/10"
                      >
                        {v.dias}d sem mov.
                      </Badge>
                    </div>
                  ))}
                  {stats.vagasSemCandidatos.length > 4 && (
                    <p className="text-xs text-muted-foreground text-right">
                      +{stats.vagasSemCandidatos.length - 4} vagas
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}
