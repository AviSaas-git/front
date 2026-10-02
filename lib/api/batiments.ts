import { apiClient } from "./client"
import type { BatimentFormData } from "@/lib/types/forms"

export type Batiment = {
  id:            string
  fermeId:       string
  nom:           string
  capacite:      number
  surfaceM2?:    number
  typeChauffage?: string
  type:          string
}

/*export type BatimentData = {
  id:       string
  nom:      string
  capacite: number
  type:     string
  fermeId:  string
}*/

export type BatimentData = {
  id:                string
  nom:               string
  capacite:          number
  surfaceM2:         number | null
  typeChauffage:     string | null
  type:              string
  fermeId:           string
  fermeNom:          string
  modeOccupation:    string
  noteStatut:        string | null
  nombreSalles:      number
  sallesDisponibles: number
  salles:            SalleData[]
}

export type SalleData = {
  id: string; nom: string; capacite: number
  surfaceM2: number | null
  statut: "LIBRE" | "OCCUPE" | "NETTOYAGE" | "MAINTENANCE" | "HORS_SERVICE"
  observations: string | null
}


export type BatimentDetail = {
  id: string; nom: string; capacite: number
  surfaceM2: number | null; typeChauffage: string | null
  type: string; fermeId: string; fermeNom: string
  modeOccupation: string; noteStatut: string | null
  nombreSalles: number; sallesDisponibles: number
  salles: SalleData[]
}




export async function creerBatiment(
  data: BatimentFormData & { fermeId: string }
): Promise<Batiment> {

  console.log("DONNEES ENVOYEES =", data)
  const res = await apiClient.post<Batiment>(
    "/api/v1/batiments",
    data
  )

  return res.data
}

export async function listerBatiments(fermeId: string): Promise<Batiment[]> {
  const res = await apiClient.get<Batiment[]>(
    `/api/v1/batiments?fermeId=${fermeId}`
  )
  return res.data
}

export async function fetchBatiments(): Promise<BatimentData[]> {
  const res = await apiClient.get<BatimentData[]>("/api/v1/batiments")

  console.log(" res batiment : "+ res)
  return res.data
}


export const fetchSalles = (batimentId: string) =>
  apiClient.get<SalleData[]>(`/api/v1/batiments/${batimentId}/salles`)
    .then(r => r.data)

export const fetchBatiment = (batimentId: string) =>
  apiClient.get<BatimentDetail>(`/api/v1/batiments/${batimentId}`).then(r => r.data)

export const createSalle = (batimentId: string, data: {
  nom: string; capacite: number; surfaceM2?: number; observations?: string
}) => apiClient.post<SalleData>(`/api/v1/batiments/${batimentId}/salles`, data)
      .then(r => r.data)

export const changerStatutSalle = (batimentId: string, salleId: string, data: {
  statut: string; observations?: string
}) => apiClient.patch<SalleData>(
      `/api/v1/batiments/${batimentId}/salles/${salleId}/statut`, data)
      .then(r => r.data)

export const changerStatutBatiment = (batimentId: string, data: {
  statut: string; noteStatut?: string
}) => apiClient.patch(`/api/v1/batiments/${batimentId}/statut`, data)
      .then(r => r.data)

export const deleteSalle = (batimentId: string, salleId: string): Promise<void> =>
  apiClient.delete(`/api/v1/batiments/${batimentId}/salles/${salleId}`)
    .then(() => undefined)

    // ─── Bâtiment : détail, mise à jour, suppression ──────────────────────────

export const fetchBatimentDetail = (batimentId: string) =>
  apiClient.get<BatimentDetail>(`/api/v1/batiments/${batimentId}`).then(r => r.data)

export const updateBatiment = (
  batimentId: string,
  data: {
    nom?: string
    capacite?: number
    surfaceM2?: number
    typeChauffage?: string
    type?: string
  }
) => apiClient.patch<BatimentDetail>(`/api/v1/batiments/${batimentId}`, data)
      .then(r => r.data)

export const deleteBatiment = (batimentId: string): Promise<void> =>
  apiClient.delete(`/api/v1/batiments/${batimentId}`).then(() => undefined)