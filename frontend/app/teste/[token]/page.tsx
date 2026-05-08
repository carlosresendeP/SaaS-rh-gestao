"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { testService } from "@/services/test.service"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function TestWelcomePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [lgpdAccepted, setLgpdAccepted] = useState(false)

  const { data: test, isLoading, isError } = useQuery({
    queryKey: ["test-data", token],
    queryFn: () => testService.getTest(token),
    staleTime: Infinity,
    retry: false,
    throwOnError: false,
  })

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (isError || !test) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="size-12 text-destructive/60" />
        <h1 className="text-xl font-bold">Link inválido ou expirado</h1>
        <p className="text-sm text-muted-foreground">
          Este link de teste não é válido ou já foi utilizado. Entre em contato com a empresa para obter um novo link.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Boas-vindas */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
          Processo Seletivo
        </p>
        <h1 className="text-2xl font-bold">Olá, {test.candidate}!</h1>
        <p className="text-muted-foreground">
          Você foi convidado(a) para realizar os testes psicométricos do processo seletivo.
        </p>
      </div>

      {/* O que esperar */}
      <div className="rounded-xl border border-secondary/40 bg-muted/30 p-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          O que você vai fazer
        </p>
        <div className="space-y-2.5">
          {[
            { n: "1", title: "DISC",           desc: "~10 min — Identifica seu estilo de comportamento" },
            { n: "2", title: "Eneagrama",      desc: "~10 min — Mapeia motivações e padrões de personalidade" },
            { n: "3", title: "16 Personalidades", desc: "~10 min — Perfil completo de estilo cognitivo" },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-sidebar text-sidebar-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {item.n}
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          Tempo total estimado: <span className="font-semibold">30 min</span>. Não há respostas certas ou erradas — responda com honestidade.
        </p>
      </div>

      {/* LGPD */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <div
          role="checkbox"
          aria-checked={lgpdAccepted}
          tabIndex={0}
          onClick={() => setLgpdAccepted((v) => !v)}
          onKeyDown={(e) => e.key === " " && setLgpdAccepted((v) => !v)}
          className={cn(
            "mt-0.5 size-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
            lgpdAccepted
              ? "bg-primary border-primary"
              : "border-secondary bg-transparent"
          )}
        >
          {lgpdAccepted && <CheckCircle2 className="size-3.5 text-primary-foreground" />}
        </div>
        <p className="text-sm text-muted-foreground leading-snug">
          Concordo com o tratamento dos meus dados pessoais conforme a{" "}
          <span className="text-foreground underline cursor-pointer">Política de Privacidade</span>{" "}
          e a LGPD. Meus dados serão utilizados exclusivamente para fins de seleção.
        </p>
      </label>

      <Button
        disabled={!lgpdAccepted}
        onClick={() => router.push(`/teste/${token}/disc`)}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
      >
        Começar Testes
      </Button>
    </div>
  )
}
