import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(date)
  )
}

export function formatRelative(date: string | Date): string {
  const days = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86_400_000
  )
  if (days === 0) return "hoje"
  if (days === 1) return "ontem"
  return `há ${days} dias`
}

