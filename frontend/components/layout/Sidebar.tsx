"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Network,
  Bot,
  Settings,
  LogOut,
  Leaf,
  Plus,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/vagas",         label: "Vagas",         icon: Briefcase },
  { href: "/candidatos",    label: "Candidatos",   icon: Users },
  { href: "/organograma",   label: "Organograma",   icon: Network },
  { href: "/chat",          label: "Chat IA",        icon: Bot },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuth()

  const initials = user?.nome
    ? user.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?"

  function handleLogout() {
    clearAuth()
    router.replace("/login")
  }

  return (
    <aside className="h-full bg-sidebar flex flex-col py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 text-primary">
          <Leaf className="size-6" />
          <span className="text-xl font-bold text-sidebar-foreground">MakerStack RH</span>
        </div>
        <p className="text-sidebar-foreground/50 text-xs mt-1">Recrutamento Tech</p>
      </div>

      {/* Nova Vaga CTA */}
      <div className="px-4 mb-6">
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90"
        >
          <Link href="/vagas/nova">
            <Plus className="size-4 mr-2" />
            Nova Vaga
          </Link>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 border-l-4 transition-all duration-150 text-sm font-medium",
                active
                  ? "border-primary bg-sidebar-accent text-primary font-bold"
                  : "border-transparent text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-semibold truncate">{user?.nome}</p>
            <p className="text-sidebar-foreground/50 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors w-full px-1"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
