"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginFields } from "@/lib/validations/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth.service"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(LoginSchema) })

  async function onSubmit(values: LoginFields) {
    try {
      const { user, token } = await authService.login(values)
      setAuth(user, token)
      router.push("/dashboard")
    } catch {
      toast.error("E-mail ou senha incorretos", { duration: 5000 })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-sidebar">
        <div className="absolute inset-0 bg-linear-to-t from-sidebar/90 to-sidebar/30" />
        <div className="relative z-10 flex flex-col justify-start gap-5 p-10 h-full w-full">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="size-8" />
            <span className="text-2xl font-bold">MakerStack RH</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
              Moldando o futuro do trabalho.
            </h1>
            <p className="text-lg text-sidebar-foreground/70">
              Conectando empresas visionárias aos talentos que impulsionam a
              inovação no mercado brasileiro.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 text-sidebar mb-8">
            <Leaf className="size-8" />
            <span className="text-2xl font-bold">MakerStack RH</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="text-muted-foreground mt-2">
              Recrutamento inteligente para empresas brasileiras.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  E-MAIL PROFISSIONAL
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@empresa.com.br"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    SENHA
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold tracking-widest uppercase mt-1"
              >
                {isSubmitting ? (
                  "Entrando..."
                ) : (
                  <>
                    ENTRAR
                    <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-foreground hover:underline font-bold">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-muted-foreground/70">
            <Link href="#" className="text-xs hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <span className="text-xs">•</span>
            <Link href="#" className="text-xs hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
