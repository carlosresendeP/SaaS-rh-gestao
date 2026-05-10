import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./Header";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header logoUrl={null} companyName="..." />
      <main className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </main>
    </div>
  );
}
