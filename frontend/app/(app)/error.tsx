"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full py-24 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <div>
        <h2 className="font-semibold text-foreground">Algo deu errado</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message || "Ocorreu um erro inesperado. Tente novamente."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
