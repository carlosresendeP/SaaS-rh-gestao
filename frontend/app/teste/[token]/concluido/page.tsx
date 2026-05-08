"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2 } from "lucide-react"
import { testService } from "@/services/test.service"

export default function ConcluidoPage() {
  const { token } = useParams<{ token: string }>()

  // Served from cache (staleTime: Infinity) — token is already invalidated by submit
  const { data: test } = useQuery({
    queryKey: ["test-data", token],
    queryFn: () => testService.getTest(token),
    staleTime: Infinity,
    retry: false,
    throwOnError: false,
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
        <CheckCircle2 className="size-10 text-sidebar" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Testes concluídos!</h1>
        <p className="text-muted-foreground">
          Obrigado por participar
          {test?.candidate ? (
            <>, <span className="font-semibold text-foreground">{test.candidate}</span></>
          ) : null}!
        </p>
      </div>

      <div className="rounded-xl border border-secondary/40 bg-muted/30 p-5 space-y-2 text-left w-full">
        <p className="text-sm font-semibold">O que acontece agora?</p>
        <ul className="space-y-1.5">
          {[
            "Seus resultados foram registrados e enviados para a equipe de RH.",
            "A empresa irá analisar seu perfil psicométrico.",
            "Você receberá um e-mail com seus resultados em breve.",
            "A equipe entrará em contato com os próximos passos do processo.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        Esta janela pode ser fechada com segurança.
      </p>
    </div>
  )
}
