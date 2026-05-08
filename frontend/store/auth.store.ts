import { create } from "zustand"
import { api } from "@/lib/api"
import { tokenStorage } from "@/lib/tokens"
import type { AuthUser, ApiResponse } from "@/types/api"

interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean
  setAuth:         (user: AuthUser, token: string) => void
  clearAuth:       () => void
  hydrate:         () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    tokenStorage.set(token)
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    tokenStorage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },

  hydrate: async () => {
    const token = tokenStorage.get()
    if (!token) return
    try {
      const { data } = await api.get<ApiResponse<AuthUser>>("/me")
      set({ user: data.data, token, isAuthenticated: true })
    } catch {
      tokenStorage.clear()
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
