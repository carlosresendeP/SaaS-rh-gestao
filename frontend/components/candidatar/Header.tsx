import Image from "next/image";
import { Building2 } from "lucide-react";

export function Header({
  logoUrl,
  companyName,
}: {
  logoUrl: string | null;
  companyName: string;
}) {
  return (
    <header className="border-b border-border bg-card px-4 sm:px-8 py-4 flex items-center gap-3">
      {logoUrl ? (
        <Image src={logoUrl} alt={companyName} className="h-8 object-contain" width={60} height={30} />
      ) : (
        <div className="size-8 rounded-lg bg-sidebar/20 flex items-center justify-center">
          <Building2 className="size-4 text-sidebar" />
        </div>
      )}
      <span className="font-semibold text-sm text-foreground">
        {companyName}
      </span>
      <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
        <Image src="/icon-logo.webp" alt="Logo" className="" width={40} height={20} />
        <span className="text-xl font-bold text-sidebar">
          EnvieAgora<span className="text-primary text-shadow-sm"> RH</span>
        </span>
      </div>
    </header>
  );
}
