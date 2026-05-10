import { CheckCircle2 } from "lucide-react";
import { Header } from "./Header";
import type { PublicJob } from "@/services/public.service";

interface SuccessStateProps {
  job: PublicJob | null;
  companyName: string;
  hasResume: boolean;
}

export function SuccessState({ job, companyName, hasResume }: SuccessStateProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        logoUrl={job?.company?.logoUrl ?? null}
        companyName={companyName}
      />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-8 text-sidebar" />
          </div>
          <h2 className="text-2xl font-bold">Candidatura enviada!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sua candidatura para <strong>{job?.titulo}</strong> em{" "}
            <strong>{companyName}</strong> foi recebida com sucesso.
            {hasResume && " Seu currículo foi anexado."}
          </p>
          <p className="text-xs text-muted-foreground">
            A equipe de RH entrará em contato caso seu perfil seja selecionado.
          </p>
        </div>
      </main>
    </div>
  );
}
