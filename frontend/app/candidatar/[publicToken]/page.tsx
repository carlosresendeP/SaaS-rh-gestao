"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Paperclip,
  Upload,
  X,
  Link,
} from "lucide-react";
import { Header } from "@/components/candidatar/Header";
import { LoadingState } from "@/components/candidatar/LoadingState";
import { ErrorState } from "@/components/candidatar/ErrorState";
import { SuccessState } from "@/components/candidatar/SuccessState";
import { JobInfoCard } from "@/components/candidatar/JobInfoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { publicService, type PublicJob } from "@/services/public.service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { publicTokenSchema, type PublicTokenFormData } from "@/lib/validations/publicToken";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(min?: string | null, max?: string | null) {
  if (!min && !max) return null;
  const fmt = (v: string) => `R$ ${Number(v).toLocaleString("pt-BR")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `A partir de ${fmt(min)}`;
  return `Até ${fmt(max!)}`;
}


// ─── States ───────────────────────────────────────────────────────────────────

type PageState =
  | "loading"
  | "error"
  | "form"
  | "uploading"
  | "submitting"
  | "success";

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CandidatarPage() {
  const { publicToken } = useParams<{ publicToken: string }>();

  const [state, setState] = useState<PageState>("loading");
  const [job, setJob] = useState<PublicJob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublicTokenFormData>({ resolver: zodResolver(publicTokenSchema) });

  useEffect(() => {
    publicService
      .getJob(publicToken)
      .then((data) => {
        setJob(data);
        setState("form");
      })
      .catch((err) => {
        setErrorMsg(
          err?.response?.data?.error ?? "Vaga não encontrada ou link inválido.",
        );
        setState("error");
      });
  }, [publicToken, retryCount]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Apenas arquivos PDF são aceitos.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 5 MB.");
      return;
    }
    setPdfFile(file);
  }

  async function onSubmit(values: PublicTokenFormData) {
    if (!job) return;

    // Currículo PDF é obrigatório
    if (!pdfFile) {
      setPdfError("O currículo em PDF é obrigatório.");
      return;
    }
    setPdfError("");

    setState("uploading");
    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 20, 90));
    }, 200);
    let curriculoUrl: string;
    try {
      curriculoUrl = await publicService.uploadResume(pdfFile);
    } catch {
      clearInterval(interval);
      setState("form");
      setPdfError("Erro ao enviar o PDF. Tente novamente.");
      return;
    }
    clearInterval(interval);
    setUploadProgress(100);

    setState("submitting");
    try {
      await publicService.apply({
        jobId: job.id,
        nome: values.nome,
        email: values.email,
        telefone: values.telefone || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        curriculoUrl,
      });
      setState("success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Erro ao enviar candidatura. Tente novamente.";
      setErrorMsg(msg);
      setState("form");
    }
  }

  const companyName =
    job?.company?.nome ?? job?.company?.razaoSocial ?? "Empresa";
  const salary = job ? formatSalary(job.salaryMin, job.salaryMax) : null;
  const description = job?.jdGerada ?? job?.descricao;

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (state === "loading") {
    return <LoadingState />;
  }

  // ─── Error ──────────────────────────────────────────────────────────────────

  if (state === "error") {
    return (
      <ErrorState
        errorMsg={errorMsg}
        onRetry={() => {
          setState("loading");
          setRetryCount((c) => c + 1);
        }}
      />
    );
  }

  // ─── Success ─────────────────────────────────────────────────────────────────

  if (state === "success") {
    return (
      <SuccessState
        job={job}
        companyName={companyName}
        hasResume={!!pdfFile}
      />
    );
  }

  // ─── Form ────────────────────────────────────────────────────────────────────

  const isWorking = state === "uploading" || state === "submitting";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        logoUrl={job?.company?.logoUrl ?? null}
        companyName={companyName}
      />

      <main className="flex-1 flex items-start justify-center p-4 sm:p-8 pt-8">
        <div className="w-full max-w-xl space-y-6">
          {/* Banner de vaga pausada */}
          {job?.status === "PAUSADA" && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300">
              Esta vaga está temporariamente pausada. As candidaturas ainda
              podem ser recebidas.
            </div>
          )}

          {/* Job info card */}
          <JobInfoCard
            job={job}
            companyName={companyName}
            salary={salary}
            description={description}
          />

          {/* Error banner */}
          {errorMsg && state === "form" && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {errorMsg}
            </div>
          )}

          {/* Apply form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Seus dados
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  placeholder="João da Silva"
                  {...register("nome")}
                />
                {errors.nome && (
                  <p className="text-xs text-destructive">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@exemplo.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 91234-5678"
                  {...register("telefone")}
                />
                {errors.telefone && (
                  <p className="text-xs text-destructive">
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="linkedinUrl"
                  className="flex items-center gap-1.5"
                >
                  <Link className="size-3.5 text-muted-foreground" />
                  LinkedIn
                  <span className="text-xs text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  {...register("linkedinUrl")}
                />
                {errors.linkedinUrl && (
                  <p className="text-xs text-destructive">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>

              {/* PDF Upload */}
              <div className="space-y-1.5">
                <Label>
                  Currículo em PDF <span className="text-destructive">*</span>
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {pdfFile ? (
                  <div className="flex items-center gap-3 rounded-lg border border-sidebar/40 bg-sidebar/5 px-3 py-2.5">
                    <Paperclip className="size-4 text-sidebar shrink-0" />
                    <span className="flex-1 text-sm truncate text-foreground">
                      {pdfFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="size-5 rounded-full hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border",
                      "py-6 text-muted-foreground hover:border-sidebar/40 hover:bg-muted/30 transition-all",
                    )}
                  >
                    <Upload className="size-5" />
                    <span className="text-sm">
                      Clique para selecionar o PDF
                    </span>
                    <span className="text-xs">Máximo 5 MB</span>
                  </button>
                )}
              </div>

              {pdfError && (
                <p className="text-xs text-destructive">{pdfError}</p>
              )}

              {/* Upload progress */}
              {state === "uploading" && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Enviando currículo… {uploadProgress}%
                  </p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-sidebar transition-all duration-200 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isWorking}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
            >
              {state === "uploading"
                ? "Enviando currículo…"
                : state === "submitting"
                  ? "Enviando candidatura…"
                  : "Enviar Candidatura"}
            </Button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              Ao se candidatar, você concorda com o tratamento dos seus dados
              para fins de seleção conforme a LGPD. Seus dados não serão
              compartilhados com terceiros.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

