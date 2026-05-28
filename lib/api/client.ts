import axios from "axios"

// URL API Spring Boot
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// ─────────────────────────────────────────────
// INTERCEPTEUR REQUEST
// ─────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  // Vérifie qu'on est côté navigateur
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("avisaas_token")

    console.log(
      "Token envoyé : 45",
      token ? token.substring(0, 20) + "..." : "AUCUN"
    )

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

// ─────────────────────────────────────────────
// INTERCEPTEUR RESPONSE
// ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (typeof window !== "undefined") {

      // JWT expiré
      if (error.response?.status === 401) {
        localStorage.removeItem("avisaas_token")
        localStorage.removeItem("avisaas_user")

        window.location.href = "/login"
      }
    }

    // Erreur métier
    if (error.response?.status === 422) {
      return Promise.reject(
        new Error(
          error.response.data?.message ??
          "Règle métier non respectée"
        )
      )
    }

    // Erreur serveur
    if (error.response?.status >= 500) {
      return Promise.reject(
        new Error(
          "Erreur serveur. Réessayez dans quelques instants."
        )
      )
    }

    return Promise.reject(error)
  }
)