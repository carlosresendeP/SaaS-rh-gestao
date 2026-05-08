"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CadastroSchema, type CadastroFields } from "@/lib/validations/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, User, Mail, Lock, Building2, Hash, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth.service"

export default function CadastroPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFields>({ resolver: zodResolver(CadastroSchema) })

  async function onSubmit(values: CadastroFields) {
    try {
      await authService.signup(values)
      toast.success("Conta criada! Faça seu login para continuar.")
      router.push("/login")
    } catch {
      toast.error("Erro ao criar conta. Verifique os dados e tente novamente.", { duration: 5000 })
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
              Comece a contratar de forma inteligente.
            </h1>
            <p className="text-lg text-sidebar-foreground/70">
              Crie sua conta e tenha acesso ao recrutamento orientado por dados
              e inteligência artificial.
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
            <h2 className="text-3xl font-bold text-foreground">Crie sua conta</h2>
            <p className="text-muted-foreground mt-2">
              Gestão de talentos simplificada para sua empresa.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome" className="text-xs uppercase tracking-widest text-muted-foreground">
                  NOME COMPLETO
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="nome" type="text" placeholder="Seu nome" className="pl-10" {...register("nome")} />
                </div>
                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                  E-MAIL PROFISSIONAL
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="email" type="email" placeholder="voce@empresa.com.br" className="pl-10" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
                  SENHA
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="razaoSocial" className="text-xs uppercase tracking-widest text-muted-foreground">
                  RAZÃO SOCIAL
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="razaoSocial" type="text" placeholder="Empresa Ltda." className="pl-10" {...register("razaoSocial")} />
                </div>
                {errors.razaoSocial && <p className="text-xs text-destructive">{errors.razaoSocial.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cnpj" className="text-xs uppercase tracking-widest text-muted-foreground">
                  CNPJ
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="cnpj" type="text" placeholder="00.000.000/0000-00" className="pl-10" {...register("cnpj")} />
                </div>
                {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold tracking-widest uppercase mt-1"
              >
                {isSubmitting ? (
                  "Criando conta..."
                ) : (
                  <>
                    CRIAR CONTA
                    <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-foreground hover:underline font-bold">
                  Entrar
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
