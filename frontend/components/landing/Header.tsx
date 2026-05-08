"use client"

import { useState } from "react"
import { Leaf, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = ["Soluções", "Preços", "Sobre"]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full max-w-[1440px] mx-auto px-6 py-4 relative z-20">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Leaf className="size-7 text-primary" strokeWidth={2.5} />
          <span className="text-xl font-bold text-foreground tracking-tight">
            MakerStack RH
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium uppercase tracking-wide"
            >
              {link}
            </a>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground"
          >
            Entrar
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm font-medium uppercase tracking-wide px-3 py-2.5 rounded-md"
            >
              {link}
            </a>
          ))}
          <div className="pt-3 mt-1 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full hover:bg-primary hover:text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
