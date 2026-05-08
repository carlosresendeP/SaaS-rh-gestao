import { Leaf } from "lucide-react"
import { ProgressBar } from "./ProgressBar"

export default function TesteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-secondary/20 px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-1.5">
          <Leaf className="size-4 text-sidebar" />
          <span className="font-bold text-foreground text-sm">MakerStack RH</span>
        </div>
        <span className="text-xs text-muted-foreground">Portal do Candidato</span>
      </header>

      <ProgressBar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
