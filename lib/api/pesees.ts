import { apiClient } from "./client"

export type PeseeEntry = {
  id: string
  date: string
  ageEnJours: number
  nombreSujetsPeses: number
  poidsMoyenGrammes: number
  poidsCibleGrammes: number | null
  ecartPct: number | null
}

export type CourbePoint = {
  jour: number
  poidsCibleGrammes: number | null
  poidsReelGrammes: number | null
}

export async function fetchPesees(bandeId: string): Promise<PeseeEntry[]> {
  const res = await apiClient.get<PeseeEntry[]>(`/api/v1/bandes/${bandeId}/pesees`)
  return res.data
}

export async function createPesee(bandeId: string, data: {
  date: string; nombreSujetsPeses: number; poidsTotalKg: number
}): Promise<PeseeEntry> {
  const res = await apiClient.post(`/api/v1/bandes/${bandeId}/pesees`, data)
  return res.data
}

export async function fetchCourbeCroissance(bandeId: string): Promise<CourbePoint[]> {
  const res = await apiClient.get<CourbePoint[]>(`/api/v1/bandes/${bandeId}/courbe-croissance`)
  return res.data
}

export async function fetchCourbeReference(especeId: string): Promise<CourbePoint[]> {
  const res = await apiClient.get<CourbePoint[]>(`/api/v1/especes/${especeId}/courbe-reference`)
  return res.data
}

export async function saveCourbeReference(especeId: string, points: {
  jour: number; poidsGrammesCible: number
}[]): Promise<void> {
  await apiClient.put(`/api/v1/especes/${especeId}/courbe-reference`, { points })
}