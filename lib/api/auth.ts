import { apiClient } from "./client"
import type { RegisterFormData, LoginFormData } from "@/lib/types/forms"

// ── TYPES RÉPONSES SPRING BOOT ───────────────────────────────────────────
export type AuthUser = {
  id:       string
  nom:      string
  email:    string
  role:     string
  tenantId: string
  plan:     string
}

export type AuthResponse = {
  token:     string
  expiresIn: number
  user:      AuthUser
}

// ── FONCTIONS ────────────────────────────────────────────────────────────

export async function register(
  data: RegisterFormData
): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>(
    "/api/v1/auth/register",
    data
  )
  // Sauvegarde automatique du token
  saveSession(res.data)
  return res.data
}

export async function login(
  data: LoginFormData
): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>(
    "/api/v1/auth/login",
    data
  )
  saveSession(res.data)
  return res.data
}

export function logout() {
  localStorage.removeItem("avisaas_token")
  localStorage.removeItem("avisaas_user")
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem("avisaas_user")
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("avisaas_token")
}

// ── UTILITAIRE INTERNE ───────────────────────────────────────────────────
function saveSession(data: AuthResponse) {
  localStorage.setItem("avisaas_token", data.token)
  localStorage.setItem("avisaas_user", JSON.stringify(data.user))
}