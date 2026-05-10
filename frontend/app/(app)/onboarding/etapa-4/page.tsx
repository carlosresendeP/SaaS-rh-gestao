"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, KeyboardEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Zap,
  BarChart2,
  Users,
  Lightbulb,
  X,
  Plus,
} from "lucide-react";
import { companyService } from "@/services/company.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PERFIS = [
  {
    value: "Acelerado",
    icon: Zap,
    description:
      "Entregas rápidas, iteração constante e agilidade nas decisões.",
  },
  {
    value: "Analítico",
    icon: BarChart2,
    description:
      "Decisões baseadas em dados, planejamento profundo e minimização de riscos.",
  },
  {
    value: "Colaborativo",
    icon: Users,
    description:
      "Construção conjunta, forte comunicação e hierarquia horizontal.",
  },
  {
    value: "Inovador",
    icon: Lightbulb,
    description:
      "Exploração de novas ideias, quebra de paradigmas e experimentação.",
  },
];

const schema = z.object({
  contextoEmpresa: z.string().min(20, "Descreva com pelo menos 20 caracteres"),
  perfilRitmo: z.string().min(1, "Selecione um perfil"),
  valores: z.array(z.string()).min(1, "Adicione pelo menos um valor"),
});

type Fields = z.infer<typeof schema>;

export default function Etapa4Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: companyService.get,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    values: {
      contextoEmpresa: company?.contextoEmpresa ?? "",
      perfilRitmo: company?.perfilRitmo ?? "",
      valores: company?.valores ?? [],
    },
  });

  const valores = watch("valores");
  const perfilRitmo = watch("perfilRitmo");

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || valores.includes(tag)) return;
    setValue("valores", [...valores, tag], { shouldValidate: true });
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValue(
      "valores",
      valores.filter((v) => v !== tag),
      { shouldValidate: true },
    );
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  async function onSubmit(values: Fields) {
    try {
      await companyService.update({
        contextoEmpresa: values.contextoEmpresa,
        perfilRitmo: values.perfilRitmo,
        valores: values.valores,
      });
      await companyService.setOnboardingStep(5);
      // Atualiza o cache imediatamente para evitar redirect no dashboard
      queryClient.setQueryData(
        ["company"],
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, onboardingStep: 5 } : old,
      );
      toast.success("Configuração concluída! Bem-vindo ao EnvieAgora RH.");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-foreground">
          Contexto & Valores
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Essas informações alimentam a IA para gerar vagas e avaliar candidatos
          com precisão.
        </p>
      </div>

      <div className="px-8 pb-6 flex flex-col gap-6">
        {/* Contexto da empresa */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="contextoEmpresa"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            CONTEXTO DA EMPRESA
          </Label>
          <Textarea
            id="contextoEmpresa"
            placeholder="Descreva o que sua empresa faz, qual o mercado de atuação, os desafios do time e o tipo de profissional que costuma se encaixar bem..."
            rows={4}
            className="resize-none"
            {...register("contextoEmpresa")}
          />
          {errors.contextoEmpresa && (
            <p className="text-xs text-destructive">
              {errors.contextoEmpresa.message}
            </p>
          )}
        </div>

        {/* Perfil de ritmo */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            PERFIL DE RITMO
          </Label>
          <Controller
            name="perfilRitmo"
            control={control}
            render={() => (
              <div className="grid grid-cols-2 gap-3">
                {PERFIS.map(({ value, icon: Icon, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setValue("perfilRitmo", value, { shouldValidate: true })
                    }
                    className={cn(
                      "relative text-left p-4 rounded-lg border-2 transition-all",
                      perfilRitmo === value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Icon className="size-4 text-sidebar" />
                    </div>
                    <p className="font-bold text-foreground text-sm mb-1">
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.perfilRitmo && (
            <p className="text-xs text-destructive">
              {errors.perfilRitmo.message}
            </p>
          )}
        </div>

        {/* Valores */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">
            VALORES DA EMPRESA
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Inovação, Transparência..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTag}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {valores.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {valores.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1.5"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {errors.valores && (
            <p className="text-xs text-destructive">{errors.valores.message}</p>
          )}
        </div>
      </div>

      <div className="px-8 py-4 border-t border-border flex justify-between bg-muted/30">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/onboarding/etapa-3")}
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="font-bold">
          {isSubmitting ? "Finalizando..." : "Concluir configuração"}
        </Button>
      </div>
    </form>
  );
}
