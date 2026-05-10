"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Building2, Upload, Loader2, ArrowRight, X } from "lucide-react"
import { companyService } from "@/services/company.service"
import { publicService } from "@/services/public.service"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Fields {
  nome: string
  logoUrl: string
}

export default function Etapa1Page() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: companyService.get,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<Fields>({
    values: {
      nome: company?.nome ?? "",
      logoUrl: company?.logoUrl ?? "",
    },
  })

  const logoUrl = watch("logoUrl")

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Selecione uma imagem."); return }
    if (file.size > 2 * 1024 * 1024) { toast.error("Imagem muito grande. Máximo 2 MB."); return }
    setIsUploading(true)
    try {
      const url = await publicService.uploadFile(file)
      setValue("logoUrl", url)
    } catch {
      toast.error("Erro ao fazer upload. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(values: Fields) {
    try {
      await companyService.update({
        ...(values.nome.trim() && { nome: values.nome.trim() }),
        ...(values.logoUrl.trim() && { logoUrl: values.logoUrl.trim() }),
      })
      await companyService.setOnboardingStep(2)
      router.push("/onboarding/etapa-2")
    } catch {
      toast.error("Erro ao salvar dados. Tente novamente.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-foreground">Dados da Empresa</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure como sua empresa aparecerá na plataforma.
        </p>
      </div>

      <div className="px-8 pb-6 flex flex-col gap-5">
        {/* Razão Social — readonly */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            RAZÃO SOCIAL
          </Label>
          <Input
            value={company?.razaoSocial ?? ""}
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* CNPJ — readonly */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            CNPJ
          </Label>
          <Input
            value={company?.cnpj ?? ""}
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* Nome de exibição */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="nome"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            NOME DE EXIBIÇÃO <span className="normal-case tracking-normal">(opcional)</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="nome"
              placeholder="Ex: MakerStack RH"
              className="pl-10"
              {...register("nome")}
            />
          </div>
        </div>

        {/* Logo upload */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            LOGOTIPO <span className="normal-case tracking-normal">(opcional)</span>
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          {logoUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <img src={logoUrl} alt="Logo" className="h-8 object-contain rounded" />
              <span className="flex-1 text-sm text-muted-foreground truncate">{logoUrl}</span>
              <button
                type="button"
                onClick={() => { setValue("logoUrl", ""); if (fileInputRef.current) fileInputRef.current.value = "" }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full justify-center gap-2"
            >
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {isUploading ? "Enviando..." : "Fazer upload do logotipo"}
            </Button>
          )}
        </div>
      </div>

      <div className="px-8 py-4 border-t border-border flex justify-end bg-muted/30">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Continuar"}
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}
