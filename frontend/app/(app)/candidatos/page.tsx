"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Zap, Clock, FlaskConical, ChevronDown, Users } from "lucide-react"
import { applicationService } from "@/services/application.service"
import { jobService } from "@/services/job.service"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus } from "@/types/api"

// ── Pipeline config ──────────────────────────────────────────────────────────

const COLUMNS: { value: ApplicationStatus; label: string; headerClass: string }[] = [
  { value: "PENDENTE",           label: "Pendente",            headerClass: "border-t-muted-foreground/40" },
  { value: "EM_ANALISE",         label: "Em Análise",          headerClass: "border-t-primary" },
  { value: "TESTE_PSICOMETRICO", label: "Teste Psicométrico",  headerClass: "border-t-sidebar" },
  { value: "ENTREVISTA",         label: "Entrevista",          headerClass: "border-t-yellow-500" },
  { value: "APROVADO",           label: "Aprovado",            headerClass: "border-t-green-600" },
  { value: "REPROVADO",          label: "Reprovado",           headerClass: "border-t-destructive" },
]

const NEXT_STATUS: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  PENDENTE:           "EM_ANALISE",
  EM_ANALISE:         "TESTE_PSICOMETRICO",
  TESTE_PSICOMETRICO: "ENTREVISTA",
  ENTREVISTA:         "APROVADO",
}

// ── Candidate card ───────────────────────────────────────────────────────────

interface CandidateCardProps {
  app: Application
  onStatusChange: (id: string, status: ApplicationStatus) => void
}

function CandidateCard({ app, onStatusChange }: CandidateCardProps) {
  const router = useRouter()
  const hasScore = app.matchScore !== null && app.matchScore !== undefined
  const testeDone = !!app.candidate?.testCompletedAt

  return (
    <div
      className="bg-card rounded-lg border border-secondary/40 p-3 shadow-sm hover:border-primary/40 transition-colors cursor-pointer space-y-3"
      onClick={() => router.push(`/candidatos/${app.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {app.candidate?.nome ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {(app.job as { titulo?: string } | undefined)?.titulo ?? "Vaga"}
          </p>
        </div>
        {hasScore && (
          <span
            className={cn(
              "shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
              app.matchScore! >= 80
                ? "bg-primary/20 text-primary"
                : app.matchScore! >= 60
                ? "bg-sidebar/20 text-sidebar-foreground"
                : "bg-secondary/30 text-muted-foreground"
            )}
          >
            <Zap className="size-3" />
            {app.matchScore}%
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {testeDone ? (
            <span className="flex items-center gap-1 text-[10px] text-sidebar font-medium">
              <FlaskConical className="size-3" />
              Teste feito
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <FlaskConical className="size-3" />
              Teste pendente
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-3" />
          {app.createdAt?.split(" ")[0] ?? "—"}
        </span>
      </div>

      {/* Status move button */}
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-muted-foreground border border-secondary/40 rounded px-2 py-1 hover:border-primary/40 transition-colors">
            Mover para
            <ChevronDown className="size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-sm">
          {COLUMNS.filter((c) => c.value !== app.status).map((col) => (
            <DropdownMenuItem
              key={col.value}
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange(app.id, col.value)
              }}
            >
              {col.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── Skeleton column ──────────────────────────────────────────────────────────

function ColumnSkeleton() {
  return (
    <div className="w-64 shrink-0 space-y-3">
      <Skeleton className="h-9 rounded-lg" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-lg" />
      ))}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CandidatosPage() {
  const queryClient = useQueryClient()
  const [selectedJobId, setSelectedJobId] = useState<string>("all")

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["applications", "company"],
    queryFn: applicationService.listByCompany,
  })

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.list,
  })

  const { mutate: moveStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "company"] })
    },
  })

  const filtered =
    selectedJobId === "all"
      ? (applications ?? [])
      : (applications ?? []).filter((a) => a.jobId === selectedJobId)

  const byStatus = Object.fromEntries(
    COLUMNS.map((col) => [col.value, filtered.filter((a) => a.status === col.value)])
  ) as Record<ApplicationStatus, Application[]>

  const totalCandidates = filtered.length

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-secondary/20 shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Candidatos</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalCandidates} candidato{totalCandidates !== 1 ? "s" : ""} no pipeline
            </p>
          </div>

          {/* Job filter */}
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="border border-secondary/40 rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todas as vagas</option>
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto px-6 py-5">
        {appsLoading ? (
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => <ColumnSkeleton key={i} />)}
          </div>
        ) : (
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map((col) => {
              const cards = byStatus[col.value] ?? []
              return (
                <div
                  key={col.value}
                  className={cn(
                    "w-64 shrink-0 flex flex-col rounded-lg border border-secondary/30 border-t-4 bg-muted/20 overflow-hidden",
                    col.headerClass
                  )}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-secondary/20 bg-card">
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {col.label}
                    </span>
                    <span className="text-xs font-bold bg-secondary/30 text-muted-foreground px-2 py-0.5 rounded-full">
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {cards.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground/40">
                        <Users className="size-6" />
                        <p className="text-xs">Nenhum candidato</p>
                      </div>
                    ) : (
                      cards.map((app) => (
                        <CandidateCard
                          key={app.id}
                          app={app}
                          onStatusChange={(id, status) => moveStatus({ id, status })}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
