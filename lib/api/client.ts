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

  // ✅ Routes publiques
  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register")

  // ✅ Ne pas envoyer le token sur login/register
  if (!isAuthRoute && typeof window !== "undefined") {
    const token = localStorage.getItem("avisaas_token")

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
    const status = error.response?.status

    if (typeof window !== "undefined") {
      // 🟢 AJUSTEMENT : On intercepte les 401 ET les 403 pour la session
      if (status === 401 || status === 403) {
        localStorage.removeItem("avisaas_token")
        localStorage.removeItem("avisaas_user")

        // 🟢 On n'affiche le toast QUE si la session est vraiment expirée/interdite
        import("react-hot-toast").then(({ default: toast }) => {
          toast.error("Session expirée ou accès refusé. Reconnectez-vous.", {
            duration: 4000,
            style: {
              background: "#1c0a0a",
              color: "#fca5a5",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: "12px",
              fontSize: "13px",
            },
          })
        })

        // Redirection vers le login si on n'y est pas déjà
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
        return Promise.reject(error)
      }
    }

    // ==============================
    // 🔥 EXTRACTION UNIFIÉE MESSAGE
    // ==============================
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erreur inconnue"

    // 🔥 Erreurs métier (400, 409, 422)
    if (status === 400 || status === 409 || status === 422) {
      return Promise.reject(new Error(message))
    }

    // Erreur serveur (500+)
    if (status >= 500) {
      return Promise.reject(
        new Error("Erreur serveur. Réessayez dans quelques instants.")
      )
    }

    return Promise.reject(error)
  }
)