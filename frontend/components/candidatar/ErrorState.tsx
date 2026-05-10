import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";

interface ErrorStateProps {
  errorMsg: string;
  onRetry: () => void;
}

export function ErrorState({ errorMsg, onRetry }: ErrorStateProps) {
  const isExpired = errorMsg.toLowerCase().includes("encerrada");
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header logoUrl={null} companyName="EnvieAgora RH" />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <X className="size-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold">
            {isExpired ? "Vaga encerrada" : "Link inválido"}
          </h2>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          {!isExpired && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="size-3.5" />
              Tentar novamente
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
