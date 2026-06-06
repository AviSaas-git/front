import { apiClient } from "./client"
import type { FermeFormData } from "@/lib/types/forms"

export type Ferme = {
  id:          string
  tenantId:    string
  nom:         string
  localisation: string
  capaciteMax: number
  surfaceM2?:  number
  createdAt:   string
}

export async function creerFerme(data: FermeFormData): Promise<Ferme> {
  const res = await apiClient.post<Ferme>("/api/v1/fermes", data)
  console.log(res)
  return res.data
}

export async function listerFermes(): Promise<Ferme[]> {
  const res = await apiClient.get<Ferme[]>("/api/v1/fermes")
  return res.data
} 


export async function fetchFermes(): Promise<Ferme[]> {
  const res = await apiClient.get<Ferme[]>("/api/v1/fermes")
  return res.data
}