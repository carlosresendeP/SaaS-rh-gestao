import { Briefcase, Users, MessageSquare, CheckCircle2, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/types/api"

const kpis = [
  {
    label: "VAGAS ABERTAS",
    value: "14",
    icon: Briefcase,
    trend: { icon: TrendingUp, text: "+2 nesta semana" },
  },
  {
    label: "CANDIDATOS ATIVOS",
    value: "287",
    icon: Users,
    trend: { icon: TrendingUp, text: "+45 novos currículos" },
  },
  {
    label: "EM ENTREVISTA",
    value: "42",
    icon: MessageSquare,
    trend: { icon: Clock, text: "12 agendadas hoje" },
  },
  {
    label: "APROVADOS ESTE MÊS",
    value: "08",
    icon: CheckCircle2,
    trend: { icon: CheckCircle2, text: "Meta mensal: 15" },
  },
]

const funnelStages = [
  { label: "Triagem",           count: 287, pct: 100,  highlight: false },
  { label: "Teste Técnico",     count: 145, pct: 75,   highlight: false },
  { label: "Entrevista RH",     count: 86,  pct: 40,   highlight: false },
  { label: "Entrevista Gestor", count: 42,  pct: 20,   highlight: false },
  { label: "Oferta",            count: 14,  pct: 8,    highlight: true  },
]

const recentActivity: {
  name: string
  role: string
  initials?: string
  status: ApplicationStatus
}[] = [
  { name: "Carlos Mendes", role: "DevOps Engineer Pleno",  initials: "CM", status: "EM_ANALISE" },
  { name: "Laura Martins", role: "UX/UI Designer Sênior",  initials: "LM", status: "APROVADO"   },
  { name: "Ana Costa",     role: "Frontend Developer",      initials: "AC", status: "PENDENTE"   },
  { name: "João Pedro",    role: "Data Scientist",          initials: "JP", status: "ENTREVISTA" },
  { name: "Roberto Silva", role: "Engineering Manager",     initials: "RS", status: "EM_ANALISE" },
]

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  PENDENTE:           { label: "PENDENTE",    className: "bg-muted text-foreground border-border" },
  EM_ANALISE:         { label: "EM ANÁLISE",  className: "bg-muted text-foreground border-border" },
  TESTE_PSICOMETRICO: { label: "TESTE",       className: "bg-accent/20 text-accent-foreground border-accent/40" },
  ENTREVISTA:         { label: "ENTREVISTA",  className: "bg-primary/20 text-primary-foreground border-primary/40" },
  APROVADO:           { label: "APROVADO",    className: "bg-sidebar text-sidebar-foreground border-sidebar" },
  REPROVADO:          { label: "REPROVADO",   className: "bg-destructive/20 text-foreground border-destructive/40" },
}

export default function DashboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend.icon
          return (
            <Card key={kpi.label} className="border-secondary/40 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground">
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

      {/* Bento: Funnel + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <Card className="lg:col-span-2 border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Funil de Recrutamento Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 py-4">
              {funnelStages.map((stage) => (
                <div key={stage.label} className="relative h-12 flex items-center w-full group">
                  {/* Track */}
                  <div
                    className="absolute left-0 h-full rounded-r-full bg-secondary/20"
                    style={{ width: "100%" }}
                  />
                  {/* Fill */}
                  <div
                    className={cn(
                      "absolute left-0 h-full rounded-r-full flex items-center px-4 transition-all",
                      stage.highlight
                        ? "bg-primary"
                        : "bg-sidebar group-hover:bg-sidebar-accent"
                    )}
                    style={{ width: `${stage.pct}%` }}
                  >
                    <span
                      className={cn(
                        "font-bold text-sm w-36 truncate",
                        stage.highlight ? "text-primary-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        "ml-auto font-bold text-lg",
                        stage.highlight ? "text-primary-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      {stage.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-secondary/40 shadow-sm flex flex-col">
          <CardHeader className="pb-0 flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Atividade Recente
            </CardTitle>
            <button className="text-sidebar text-xs hover:underline font-medium">
              Ver todas
            </button>
          </CardHeader>
          <CardContent className="flex-1 pt-4 px-3 pb-3 overflow-y-auto">
            <div className="flex flex-col">
              {recentActivity.map((item, i) => {
                const cfg = statusConfig[item.status]
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 border-b border-secondary/20 last:border-0 hover:bg-muted/50 transition-colors rounded-lg px-2"
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] font-bold whitespace-nowrap", cfg.className)}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
