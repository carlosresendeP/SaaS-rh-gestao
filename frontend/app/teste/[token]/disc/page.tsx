"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { testService } from "@/services/test.service"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DiscQuestion, DiscValue } from "@/types/api"

const PAGE_SIZE = 5

type DiscAnswers = Record<string, DiscValue>

function loadFromStorage(token: string): DiscAnswers {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(sessionStorage.getItem(`disc_${token}`) ?? "{}") as DiscAnswers
  } catch { return {} }
}

// ── DISC question card ──────────────────────────────────────────────────────

interface DiscCardProps {
  question: DiscQuestion
  value: DiscValue | undefined
  onChange: (v: DiscValue) => void
}

function DiscCard({ question, value, onChange }: DiscCardProps) {
  return (
    <div className="rounded-xl border border-secondary/40 overflow-hidden">
      <div className="bg-muted/40 px-4 py-3 border-b border-secondary/20">
        <p className="text-sm font-medium leading-relaxed">{question.text}</p>
      </div>
      <div className="divide-y divide-secondary/20">
        {question.options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-4 py-3 transition-colors",
                selected
                  ? "bg-primary/10 text-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "size-4 rounded-full border-2 shrink-0 transition-colors",
                  selected
                    ? "border-primary bg-primary"
                    : "border-secondary/60 bg-transparent"
                )}
              />
              <span className="text-sm">{opt.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function DiscPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<DiscAnswers>(() => loadFromStorage(token))

  const { data: test, isLoading } = useQuery({
    queryKey: ["test-data", token],
    queryFn: () => testService.getTest(token),
    staleTime: Infinity,
    retry: false,
    throwOnError: false,
  })

  useEffect(() => {
    sessionStorage.setItem(`disc_${token}`, JSON.stringify(answers))
  }, [answers, token])

  if (isLoading || !test) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    )
  }

  const disc = test.questions.disc
  const totalPages = Math.ceil(disc.length / PAGE_SIZE)
  const pageQuestions = disc.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const answeredTotal = Object.keys(answers).length
  const canProceed = pageQuestions.every((q) => answers[q.id] !== undefined)
  const isLastPage = page === totalPages - 1

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Teste DISC</h2>
        <p className="text-sm text-muted-foreground">
          Para cada situação, escolha a opção que <span className="font-semibold text-foreground">mais</span> descreve você.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{answeredTotal} de {disc.length} respondidas</span>
          <span>Página {page + 1} de {totalPages}</span>
        </div>
        <div className="h-1.5 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(answeredTotal / disc.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {pageQuestions.map((q) => (
          <DiscCard
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-secondary/20 bg-background px-4 py-3 flex gap-3 max-w-lg mx-auto">
        <Button
          variant="outline"
          className="flex-1"
          disabled={page === 0}
          onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0) }}
        >
          <ChevronLeft className="size-4 mr-1" />
          Anterior
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!canProceed}
          onClick={() => {
            if (isLastPage) {
              router.push(`/teste/${token}/eneagrama`)
            } else {
              setPage((p) => p + 1)
              window.scrollTo(0, 0)
            }
          }}
        >
          {isLastPage ? "Próximo Teste" : "Próxima"}
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
