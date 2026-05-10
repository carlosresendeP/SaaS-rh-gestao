import type { PublicJob } from "@/services/public.service";

interface JobInfoCardProps {
  job: PublicJob | null;
  companyName: string;
  salary: string | null;
  description: string | null | undefined;
}

export function JobInfoCard({ job, companyName, salary, description }: JobInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-2">
      <h1 className="text-xl sm:text-2xl font-bold leading-tight">
        {job?.titulo}
      </h1>
      <p className="text-sm text-muted-foreground">{companyName}</p>
      {salary && (
        <p className="text-sm font-semibold text-sidebar">{salary}</p>
      )}
      {description && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pt-1 border-t border-border mt-3">
          {description.length > 400
            ? description.slice(0, 400) + "…"
            : description}
        </p>
      )}
    </div>
  );
}
