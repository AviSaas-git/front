import axios from "axios"

// L'URL de ton API Spring Boot
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000, // 10 secondes max
})

// ── INTERCEPTEUR REQUEST ─────────────────────────────────────────────────
// Ajoute automatiquement le JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("avisaas_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ── INTERCEPTEUR RESPONSE ────────────────────────────────────────────────
// Gère les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    // Token expiré → déconnexion automatique
    if (error.response?.status === 401) {
      localStorage.removeItem("avisaas_token")
      localStorage.removeItem("avisaas_user")
      window.location.href = "/login"
    }

    // Quota dépassé → message métier
    if (error.response?.status === 422) {
      return Promise.reject(
        new Error(error.response.data?.message ?? "Règle métier non respectée")
      )
    }

    // Erreur serveur générique
    if (error.response?.status >= 500) {
      return Promise.reject(
        new Error("Erreur serveur. Réessayez dans quelques instants.")
      )
    }

    return Promise.reject(error)
  }
)