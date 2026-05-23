import { create }       from "zustand"
import { persist }      from "zustand/middleware"
import type { AuthUser } from "@/lib/api/auth"

type AuthStore = {
  user:      AuthUser | null
  token:     string | null
  setAuth:   (user: AuthUser, token: string) => void
  clearAuth: () => void
  isAuth:    () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      clearAuth: () => set({ user: null, token: null }),

      isAuth: () => !!get().token,
    }),
    {
      name: "avisaas-auth", // clé localStorage
    }
  )
)