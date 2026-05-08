const KEY = "saas_rh_token"
const EXPIRES_KEY = "saas_rh_token_expires"
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null
    const expires = localStorage.getItem(EXPIRES_KEY)
    if (expires && Date.now() > parseInt(expires, 10)) {
      localStorage.removeItem(KEY)
      localStorage.removeItem(EXPIRES_KEY)
      return null
    }
    return localStorage.getItem(KEY)
  },
  set: (token: string): void => {
    localStorage.setItem(KEY, token)
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + TWO_DAYS_MS))
  },
  clear: (): void => {
    localStorage.removeItem(KEY)
    localStorage.removeItem(EXPIRES_KEY)
  },
}
