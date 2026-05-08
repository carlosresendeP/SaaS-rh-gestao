const KEY = "saas_rh_token"

export const tokenStorage = {
  get:   (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(KEY) : null,
  set:   (token: string): void => localStorage.setItem(KEY, token),
  clear: (): void => localStorage.removeItem(KEY),
}
