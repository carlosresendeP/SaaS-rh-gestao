"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface CandidateEntry {
  id: string
  nome: string
  email: string
  telefone: string
  curriculoUrl: string
}

function emptyEntry(): CandidateEntry {
  return {
    id: crypto.randomUUID(),
    nome: "",
    email: "",
    telefone: "",
    curriculoUrl: "",
  }
}

interface CandidatesRepeaterProps {
  onChange: (candidates: CandidateEntry[]) => void
}

export function CandidatesRepeater({ onChange }: CandidatesRepeaterProps) {
  const [entries, setEntries] = useState<CandidateEntry[]>([emptyEntry()])

  function update(id: string, field: keyof Omit<CandidateEntry, "id">, value: string) {
    const updated = entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    setEntries(updated)
    onChange(updated)
  }

  function addEntry() {
    const updated = [...entries, emptyEntry()]
    setEntries(updated)
    onChange(updated)
  }

  function removeEntry(id: string) {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className="border border-secondary/40 rounded-xl p-4 space-y-3 bg-muted/20"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Candidato #{i + 1}
            </p>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="text-destructive/50 hover:text-destructive transition-colors"
                aria-label="Remover candidato"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                value={entry.nome}
                onChange={(e) => update(entry.id, "nome", e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={entry.email}
                onChange={(e) => update(entry.id, "email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input
                value={entry.telefone}
                onChange={(e) => update(entry.id, "telefone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL do Currículo</Label>
              <Input
                value={entry.curriculoUrl}
                onChange={(e) => update(entry.id, "curriculoUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEntry}
        className="w-full border-dashed border-secondary/60 hover:border-secondary text-muted-foreground"
      >
        <Plus className="size-4 mr-2" />
        Adicionar Candidato
      </Button>
    </div>
  )
}
