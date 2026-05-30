import { apiClient } from "./client"

export type EspeceRef = {
  id:                  string
  nom:                 string
  icon:                string
  modeGestion:         "LOT" | "INDIVIDUEL"
  cycleMoyenJours:     number
  dureeGestationJours: number
  gererReproduction:   boolean
}

export type BandeData = {
  id:            string
  reference:     string
  especeNom:     string
  especeIcon:    string
  especeMode:    "LOT" | "INDIVIDUEL"
  batimentNom:   string
  race:          string
  effectifInitial: number
  effectifActuel:  number
  dateArrivee:   string
  statut:        string
  tauxMortalite: number
  ageEnJours:    number
  progressionPct: number
}

// Récupère toutes les espèces disponibles
export async function fetchEspeces(): Promise<EspeceRef[]> {
  const res = await apiClient.get<EspeceRef[]>("/api/v1/especes")
  return res.data
}

// Récupère les bâtiments du tenant
export async function fetchBatiments() {
  const res = await apiClient.get("/api/v1/batiments")
  return res.data
}

// Récupère les bandes du tenant
export async function fetchBandes(): Promise<BandeData[]> {
  const res = await apiClient.get<BandeData[]>("/api/v1/bandes")
  return res.data
}

// Crée une bande (mode LOT)
export async function createBande(data: {
  especeId:       string
  batimentId:     string
  effectifInitial: number
  race?:          string
  dateArrivee:    string
  fournisseur?:   string
}): Promise<BandeData> {
  const res = await apiClient.post<BandeData>("/api/v1/bandes", data)
  return res.data
}