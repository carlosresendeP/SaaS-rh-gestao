"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const STEPS = [
  { label: "DISC",      path: "disc"           },
  { label: "Eneagrama", path: "eneagrama"      },
  { label: "16P",       path: "personalidades" },
]

export function ProgressBar() {
  const pathname = usePathname()
  const activeStep = STEPS.findIndex((s) => pathname.includes(`/${s.path}`))

  if (activeStep < 0) return null

  return (
    <div className="border-b border-secondary/20 bg-card px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const done   = i < activeStep
          const active = i === activeStep
          return (
            <div key={step.path} className="flex items-center">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "size-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                    done   && "bg-primary text-primary-foreground",
                    active && "bg-sidebar text-sidebar-foreground ring-2 ring-primary ring-offset-1",
                    !done && !active && "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-bold",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-px w-8 mx-2", i < activeStep ? "bg-primary" : "bg-secondary/30")} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
