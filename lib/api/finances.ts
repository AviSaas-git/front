import { apiClient } from "./client"

export type DepenseEntry = {
  id: string
  date: string
  categorie: "PRODUCTION" | "CHARGE_FIXE"
  sousCategorie: string
  montant: number
  fournisseur: string | null
  description: string | null
}

export type FinancesBande = {
  totalDepenses: number
  totalProduction: number
  totalChargeFixe: number
  coutParOiseau: number
  pctAlimentation: number
  parSousCategorie: Record<string, number>
  dernieresDepenses: DepenseEntry[]
}

export async function fetchFinances(bandeId: string): Promise<FinancesBande> {
  const res = await apiClient.get<FinancesBande>(`/api/v1/bandes/${bandeId}/finances`)
  return res.data
}

export async function createDepense(bandeId: string, data: {
  date: string; categorie: string; sousCategorie: string
  montant: number; fournisseur?: string; description?: string
}): Promise<DepenseEntry> {
  const res = await apiClient.post(`/api/v1/bandes/${bandeId}/finances`, data)
  return res.data
}

export async function deleteDepense(bandeId: string, depenseId: string): Promise<void> {
  await apiClient.delete(`/api/v1/bandes/${bandeId}/finances/depenses/${depenseId}`)
}