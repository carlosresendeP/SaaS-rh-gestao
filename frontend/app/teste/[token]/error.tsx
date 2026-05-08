"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function TesteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[TestPortal] Error:", error)
  }, [error])

  return (
    <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <AlertTriangle className="size-12 text-destructive/60" />
      <h1 className="text-xl font-bold">Algo deu errado</h1>
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar o portal de testes. Verifique sua conexão ou tente novamente.
      </p>
      <button
        onClick={reset}
        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
