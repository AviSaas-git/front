import { apiClient } from "./client"

export type ReproductionEntry = {
  id: string
  femelleNumero: string
  femelleNom: string | null
  maleNumero: string | null
  especeNom: string
  especeIcon: string
  dateSaillie: string
  dateMiseBasPrevue: string
  joursRestants: number
  statut: "SAILLIE" | "GESTANTE" | "MISE_BAS" | "ECHEC"
  observations: string | null
  porteeEnregistree: boolean
}

export type PorteeResult = {
  id: string
  dateMiseBas: string
  nombreNesTotal: number
  nombreNesVivants: number
  nombreNesMorts: number
  poidsMoyenNaissanceGrammes: number | null
  numerosAnimauxGeneres: string[]
}

export async function fetchReproductions(): Promise<ReproductionEntry[]> {
  const res = await apiClient.get<ReproductionEntry[]>("/api/v1/reproductions")
  return res.data
}

export async function createReproduction(data: {
  femelleId: string; maleId?: string; dateSaillie: string; observations?: string
}): Promise<ReproductionEntry> {
  const res = await apiClient.post("/api/v1/reproductions", data)
  return res.data
}

export async function confirmerGestation(id: string): Promise<ReproductionEntry> {
  const res = await apiClient.patch(`/api/v1/reproductions/${id}/confirmer-gestation`)
  return res.data
}

export async function declarerEchec(id: string): Promise<ReproductionEntry> {
  const res = await apiClient.patch(`/api/v1/reproductions/${id}/echec`)
  return res.data
}

export async function enregistrerPortee(id: string, data: {
  dateMiseBas: string; nombreNesVivants: number; nombreNesMorts: number
  poidsMoyenNaissanceGrammes?: number; observations?: string; prefixeNumero?: string
}): Promise<PorteeResult> {
  const res = await apiClient.post(`/api/v1/reproductions/${id}/portee`, data)
  return res.data
}