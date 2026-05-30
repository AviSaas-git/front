import { create } from "zustand"

type User = {
  id:       string
  nom:      string
  email:    string
  role:     string
  tenantId: string
  plan:     string
}

type AuthStore = {
  user:     User | null
  token:    string | null
  isLogged: boolean
  setAuth:  (user: User, token: string) => void
  logout:   () => void
  hydrate:  () => void  // ← recharge depuis localStorage
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:     null,
  token:    null,
  isLogged: false,

  setAuth: (user, token) => {
    // Persiste les deux dans localStorage
    localStorage.setItem("avisaas_token", token)
    localStorage.setItem("avisaas_user", JSON.stringify(user))
     console.log("Token sauvegardé :", token.substring(0, 20) + "...")
       console.log("SET AUTH EXECUTE")
      console.log(user)
     console.log(token)
    set({ user, token, isLogged: true })
  },

  logout: () => {
    localStorage.removeItem("avisaas_token")
    localStorage.removeItem("avisaas_user")
    set({ user: null, token: null, isLogged: false })
  },

  // Appelée au montage des pages protégées
  hydrate: () => {
    const token = localStorage.getItem("avisaas_token")
    const raw   = localStorage.getItem("avisaas_user")
    if (token && raw) {
      try {
        const user = JSON.parse(raw) as User
        set({ user, token, isLogged: true })

       // console.log("auth "+ user + "token" + token)
      } catch {
        // JSON corrompu → on nettoie
        localStorage.removeItem("avisaas_token")
        localStorage.removeItem("avisaas_user")
      }
    }
  },
}))