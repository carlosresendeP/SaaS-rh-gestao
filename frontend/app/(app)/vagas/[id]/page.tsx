"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Copy, Link2, SendHorizonal, User, Users } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RankingSidebar } from "@/components/relatorio/RankingSidebar"
import { CandidateAnalysis } from "@/components/relatorio/CandidateAnalysis"
import { useJob } from "@/hooks/useJobs"
import { useJobApplications } from "@/hooks/useApplications"
import { jobService } from "@/services/job.service"
import { applicationService } from "@/services/application.service"
import { cn } from "@/lib/utils"
import type { Application, JobStatus } from "@/types/api"

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  ABERTA:  { label: "ABERTA",  className: "bg-secondary/20 text-sidebar border-secondary/40" },
  PAUSADA: { label: "PAUSADA", className: "bg-muted text-muted-foreground border-border" },
  FECHADA: { label: "FECHADA", className: "bg-destructive/20 text-foreground border-destructive/40" },
}

function formatSalary(min?: string | null, max?: string | null): string {
  if (!min && !max) return "A combinar"
  const fmt = (v: string) => `R$ ${Number(v).toLocaleString("pt-BR")}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado!`))
}

function PageSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

export default function VagaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [testLinks, setTestLinks] = useState<Record<string, string>>({})

  const { data: job, isLoading: jobLoading } = useJob(id)
  const { data: applications = [], isLoading: appsLoading } = useJobApplications(id)

  const generateMatchMutation = useMutation({
    mutationFn: () => jobService.generateMatch(id, selectedApp!.candidateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications", "job", id] })
      const updated = queryClient
        .getQueryData<Application[]>(["applications", "job", id])
        ?.find((a) => a.id === selectedApp?.id)
      if (updated) setSelectedApp(updated)
      toast.success("Análise gerada com sucesso!")
    },
    onError: () => toast.error("Erro ao gerar análise. Tente novamente."),
  })

  const generateTestLinkMutation = useMutation({
    mutationFn: (appId: string) => applicationService.createTestLink(appId),
    onSuccess: (data, appId) => {
      setTestLinks((prev) => ({ ...prev, [appId]: data.url }))
      copyToClipboard(data.url, "Link do teste")
    },
    onError: () => toast.error("Erro ao gerar link. Tente novamente."),
  })

  if (jobLoading || appsLoading) return <PageSkeleton />

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Link href="/vagas" className="text-sm text-sidebar hover:underline">
          Voltar para vagas
        </Link>
      </div>
    )
  }

  const cfg = statusConfig[job.status]
  const description = job.jdGerada || job.descricao
  const publicUrl = job.publicToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/candidatar/${job.publicToken}`
    : null

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/vagas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{job.titulo}</h1>
            <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatSalary(job.salaryMin, job.salaryMax)}
            {job.lider && (
              <span className="ml-3 inline-flex items-center gap-1">
                <User className="size-3" />
                {job.lider.nome} — {job.lider.cargo}
              </span>
            )}
          </p>
        </div>

        {/* Link público de candidatura */}
        {publicUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(publicUrl, "Link da vaga")}
            className="shrink-0 gap-2"
          >
            <Link2 className="size-4" />
            Copiar Link Público
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — job info + candidate analysis */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-secondary/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              {description ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sem descrição cadastrada.</p>
              )}
            </CardContent>
          </Card>

          {job.requisitos && (
            <Card className="border-secondary/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.requisitos}
                </p>
              </CardContent>
            </Card>
          )}

          {selectedApp && (
            <Card className="border-secondary/40 shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">
                  Análise — {selectedApp.candidate?.nome ?? "Candidato"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {/* Gerar / copiar link de teste */}
                  {testLinks[selectedApp.id] ? (
                    <button
                      onClick={() => copyToClipboard(testLinks[selectedApp.id], "Link do teste")}
                      className="flex items-center gap-1 text-xs text-sidebar hover:underline"
                    >
                      <Copy className="size-3" />
                      Copiar link do teste
                    </button>
                  ) : (
                    <button
                      onClick={() => generateTestLinkMutation.mutate(selectedApp.id)}
                      disabled={generateTestLinkMutation.isPending}
                      className="flex items-center gap-1 text-xs text-sidebar hover:underline disabled:opacity-50"
                    >
                      <SendHorizonal className="size-3" />
                      {generateTestLinkMutation.isPending ? "Gerando..." : "Gerar link de teste"}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
                  >
                    Fechar ×
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <CandidateAnalysis
                  application={selectedApp}
                  onGenerateMatch={() => generateMatchMutation.mutate()}
                  isGenerating={generateMatchMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — ranking sidebar */}
        <Card className="border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="size-4" />
              Candidatos ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <RankingSidebar
              applications={applications}
              selectedId={selectedApp?.id}
              onSelect={setSelectedApp}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
