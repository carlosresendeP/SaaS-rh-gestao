"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { testService } from "@/services/test.service"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PersonalityQuestion, PersonalityValue, DiscValue } from "@/types/api"

const PAGE_SIZE = 10

type PersonalityAnswers = Record<string, PersonalityValue>

function loadPersonalityAnswers(token: string): PersonalityAnswers {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(sessionStorage.getItem(`personalidades_${token}`) ?? "{}") as PersonalityAnswers
  } catch { return {} }
}

function loadDiscAnswers(token: string): Record<string, DiscValue> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(sessionStorage.getItem(`disc_${token}`) ?? "{}") as Record<string, DiscValue>
  } catch { return {} }
}

function loadEneagramaAnswers(token: string): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(sessionStorage.getItem(`eneagrama_${token}`) ?? "{}") as Record<string, number>
  } catch { return {} }
}

// ── Binary choice card ──────────────────────────────────────────────────────

interface PersonalityCardProps {
  question: PersonalityQuestion
  value: PersonalityValue | undefined
  onChange: (v: PersonalityValue) => void
}

function PersonalityCard({ question, value, onChange }: PersonalityCardProps) {
  return (
    <div className="rounded-xl border border-secondary/40 overflow-hidden">
      <div className="bg-muted/40 px-4 py-3 border-b border-secondary/20">
        <p className="text-sm font-medium leading-relaxed">{question.text}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-secondary/20">
        {question.options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "px-4 py-3 text-sm text-left transition-colors",
                selected
                  ? "bg-primary/10 text-foreground font-medium"
                  : "bg-background text-muted-foreground hover:bg-muted/40"
              )}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PersonalidadesPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<PersonalityAnswers>(
    () => loadPersonalityAnswers(token)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: test, isLoading } = useQuery({
    queryKey: ["test-data", token],
    queryFn: () => testService.getTest(token),
    staleTime: Infinity,
    retry: false,
    throwOnError: false,
  })

  useEffect(() => {
    sessionStorage.setItem(`personalidades_${token}`, JSON.stringify(answers))
  }, [answers, token])

  if (isLoading || !test) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    )
  }

  const personalities = test.questions.personalities
  const totalPages = Math.ceil(personalities.length / PAGE_SIZE)
  const pageQuestions = personalities.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const answeredTotal = Object.keys(answers).length
  const canProceed = pageQuestions.every((q) => answers[q.id] !== undefined)
  const isLastPage = page === totalPages - 1

  async function handleSubmit() {
    const disc = loadDiscAnswers(token)
    const eneagrama = loadEneagramaAnswers(token)
    const personalities = { ...answers }

    setIsSubmitting(true)
    try {
      await testService.submit(token, { disc, eneagrama, personalities })

      sessionStorage.removeItem(`disc_${token}`)
      sessionStorage.removeItem(`eneagrama_${token}`)
      sessionStorage.removeItem(`personalidades_${token}`)

      router.push(`/teste/${token}/concluido`)
    } catch {
      toast.error("Erro ao enviar respostas. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold">16 Personalidades</h2>
        <p className="text-sm text-muted-foreground">
          Último teste! Para cada situação, escolha a opção que mais representa você.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{answeredTotal} de {personalities.length} respondidas</span>
          <span>Página {page + 1} de {totalPages}</span>
        </div>
        <div className="h-1.5 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(answeredTotal / personalities.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {pageQuestions.map((q) => (
          <PersonalityCard
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
          />
        ))}
      </div>

      {isLastPage && canProceed && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">Você concluiu todos os testes!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Clique em Enviar Resultados para finalizar.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-secondary/20 bg-background px-4 py-3 flex gap-3 max-w-lg mx-auto">
        <Button
          variant="outline"
          className="flex-1"
          disabled={page === 0 || isSubmitting}
          onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0) }}
        >
          <ChevronLeft className="size-4 mr-1" />
          Anterior
        </Button>

        {isLastPage ? (
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!canProceed || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Resultados"
            )}
          </Button>
        ) : (
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!canProceed}
            onClick={() => { setPage((p) => p + 1); window.scrollTo(0, 0) }}
          >
            Próxima
            <ChevronRight className="size-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
