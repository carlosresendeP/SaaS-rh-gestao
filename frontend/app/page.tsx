import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Brain, Kanban, Bot, Check, PlayCircle, Star, Rocket } from "lucide-react"
import { Header } from "@/components/landing/Header"

const VALUE_CARDS = [
  {
    icon: Brain,
    iconBg: "bg-accent/20",
    iconColor: "text-accent-foreground",
    title: "Match de Cultura",
    description:
      "Utilizamos avaliações baseadas em perfis DISC para garantir que o candidato prosperará no ambiente e nos valores específicos da sua equipe.",
  },
  {
    icon: Kanban,
    iconBg: "bg-secondary/30",
    iconColor: "text-secondary-foreground",
    title: "Pipeline Automatizado",
    description:
      "Gerencie todo o fluxo de candidatos em painéis eficientes. Reduza o tempo de triagem e foque em entrevistas de qualidade.",
  },
  {
    icon: Bot,
    iconBg: "bg-primary/20",
    iconColor: "text-primary-foreground",
    title: "IA de Recrutamento",
    description:
      "Gere descrições de vagas otimizadas e realize a triagem inicial de currículos automaticamente com nossa inteligência artificial.",
  },
]

const STATS = [
  { value: "14+", label: "Vagas Abertas Hoje" },
  { value: "287+", label: "Candidatos Ativos" },
  { value: "92%", label: "Precisão de Match" },
]

const SCORE_BARS = [
  { label: "Técnico (React/TS)", value: 95 },
  { label: "Cultura (Perfil 'I' DISC)", value: 88 },
  { label: "Senioridade (Liderança)", value: 90 },
]

const FEATURES = [
  "Mapeamento comportamental automático",
  "Validação técnica por IA generativa",
  "Comparativo de cultura entre time atual e candidato",
]

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground antialiased min-h-screen">

      <Header />

      <main className="w-full max-w-[1440px] mx-auto overflow-hidden">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="px-6 py-16 md:py-24 relative">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-muted to-background -z-10 rounded-b-[40px] md:rounded-br-[120px]" />

          <div className="flex flex-col gap-6 z-10 items-center text-center mx-auto max-w-4xl">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest">
              IA + RH
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] text-foreground">
              Recrutamento inteligente que entende o DNA da sua empresa
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Conecte-se aos melhores talentos através de nossa IA avançada.
              Realizamos análises DISC e match cultural para garantir não apenas
              a capacidade técnica, mas a aderência perfeita ao seu time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button size="lg" className="rounded-full px-8 shadow-md">
                Começar Agora
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
                <PlayCircle className="size-4" />
                Ver Demonstração
              </Button>
            </div>
          </div>
        </section>

        {/* ── Value Props ─────────────────────────────────────────────────── */}
        <section className="px-6 py-16 mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nossa Metodologia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Combinamos tecnologia de ponta com profunda compreensão do
              comportamento humano para transformar sua jornada de contratação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`size-7 ${card.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats Banner ────────────────────────────────────────────────── */}
        <section className="mx-6 my-12 rounded-xl overflow-hidden relative bg-[#374d28]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,255,87,0.1),transparent_50%)]" />

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 px-6 relative z-10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <span className="text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature Showcase ────────────────────────────────────────────── */}
        <section className="px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Mock UI Card */}
          <div className="order-2 lg:order-1 relative p-6 md:p-8 bg-muted rounded-xl border border-border">
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col gap-6">

              {/* Candidate header */}
              <div className="flex justify-between items-start border-b border-border pb-5">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12 border border-border">
                    <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                      LS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground">Lucas Silva</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Engenheiro Front-end
                    </p>
                  </div>
                </div>
                <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Star className="size-3.5 text-primary-foreground fill-primary-foreground" />
                  <span className="text-xs font-bold text-primary-foreground">Top Match</span>
                </div>
              </div>

              {/* Score bars */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Score de Alinhamento
                </p>
                <div className="flex flex-col gap-4">
                  {SCORE_BARS.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-foreground">{bar.label}</span>
                        <span className="text-sm font-bold text-foreground">{bar.value}%</span>
                      </div>
                      <Progress value={bar.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2 flex flex-col gap-5">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Análise Profunda
            </span>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Vá além do currículo padrão
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossa plataforma processa milhares de pontos de dados para gerar um{" "}
              <strong className="text-foreground">Score de Alinhamento</strong> holístico.
              Avaliamos não apenas a stack tecnológica, mas traços comportamentais,
              aderência aos ritos da empresa e potencial de liderança através da
              metodologia DISC integrada.
            </p>
            <ul className="flex flex-col gap-3 mt-2">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────── */}
        <section className="px-6 py-16 mt-4 mb-16 max-w-3xl mx-auto text-center">
          <div className="bg-card border border-border rounded-2xl p-10 shadow-sm flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Rocket className="size-7 text-primary-foreground" />
            </div>

            <h2 className="text-3xl font-bold text-foreground">
              Transforme seu RH hoje
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Junte-se a centenas de empresas inovadoras no Brasil que estão
              contratando de forma mais rápida, inteligente e com maior retenção
              a longo prazo.
            </p>

            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-2">
              <Input
                type="email"
                placeholder="Seu e-mail corporativo"
                className="flex-1 rounded-lg"
              />
              <Button type="button" className="rounded-lg whitespace-nowrap px-6">
                Solicitar Acesso
              </Button>
            </form>

            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Sem necessidade de cartão de crédito · Teste grátis por 14 dias
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
          © 2025 MakerStack RH · Recrutamento inteligente para o Brasil
        </p>
      </footer>
    </div>
  )
}
