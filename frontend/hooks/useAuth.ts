import { useAuthStore } from "@/store/auth.store"

export function useAuth() {
  return useAuthStore((s) => ({
    user:            s.user,
    isAuthenticated: s.isAuthenticated,
    setAuth:         s.setAuth,
    clearAuth:       s.clearAuth,
  }))
}
