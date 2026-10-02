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
  especeId: string 
}

export type MortaliteEntry = {
  id: string
  date: string
  nombreMorts: number
  cause: string | null
}

export type ProphylaxieEntry = {
  id: string
  dateApplication: string
  ageEnJoursAuTraitement: number
  traitement: string
  laboratoire: string | null
  dosage: string
  voieAdministration: string | null
  observations: string | null
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

export async function fetchBandeDetail(id: string): Promise<BandeData> {
  const res = await apiClient.get<BandeData>(`/api/v1/bandes/${id}`)
  return res.data
}

export async function fetchMortalites(bandeId: string): Promise<MortaliteEntry[]> {
  const res = await apiClient.get<MortaliteEntry[]>(`/api/v1/bandes/${bandeId}/mortalites`)
  return res.data
}

export async function createMortalite(bandeId: string, data: {
  date: string; nombreMorts: number; cause?: string
}): Promise<MortaliteEntry> {
  const res = await apiClient.post(`/api/v1/bandes/${bandeId}/mortalites`, data)
  return res.data
}

export async function fetchProphylaxies(bandeId: string): Promise<ProphylaxieEntry[]> {
  const res = await apiClient.get<ProphylaxieEntry[]>(`/api/v1/bandes/${bandeId}/prophylaxie`)
  return res.data
}

export async function createProphylaxie(bandeId: string, data: {
  dateApplication: string
  traitement: string
  laboratoire?: string
  dosage: string
  voieAdministration?: string
  observations?: string
}): Promise<ProphylaxieEntry> {
  const res = await apiClient.post(`/api/v1/bandes/${bandeId}/prophylaxie`, data)
  return res.data
}

// 
export type ConsommationEntry = {
  id: string; date: string; typeAliment: string
  quantiteKg: number; prixParKgFcfa: number
  montantFcfa: number; observations: string | null
}

export async function fetchConsommationBande(bandeId: string): Promise<ConsommationEntry[]> {
  const res = await apiClient.get<ConsommationEntry[]>(
    `/api/v1/bandes/${bandeId}/consommation-aliment`)
  return res.data
}

export async function createConsommationBande(bandeId: string, data: {
  date: string; typeAliment: string; quantiteKg: number
  prixParKgFcfa: number; observations?: string
}): Promise<ConsommationEntry> {
  const res = await apiClient.post(
    `/api/v1/bandes/${bandeId}/consommation-aliment`, data)
  return res.data
}

export async function updateBande(id: string, data: Partial<{
  race: string; fournisseur: string; batimentId: string; statut: string
}>): Promise<BandeData> {
  const res = await apiClient.patch<BandeData>(`/api/v1/bandes/${id}`, data)
  return res.data
}

export async function deleteBande(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/bandes/${id}`)
}

export async function deleteMortalite(bandeId: string, mortaliteId: string): Promise<void> {
  await apiClient.delete(`/api/v1/bandes/${bandeId}/mortalites/${mortaliteId}`)
}

export type VenteBande = {
  id: string; date: string; nombreAnimaux: number
  poidsMoyenKg: number; prixParKg: number
  montantTotal: number; acheteur: string | null; observations: string | null
}

export type RentabiliteData = {
  recettesVentesAnimaux: number; recettesVentesOeufs: number
  recettesTotales: number; chargesProduction: number
  chargesFixes: number; chargesTotales: number
  margeNette: number; margeParAnimal: number
  margeParKgVendu: number; tauxMarge: number
  coutProductionParAnimal: number; seuilRentabilite: number
  estRentable: boolean
  chargesParCategorie: Record<string, number>
  ventesAnimaux: VenteBande[]
}

export type ObjectifData = {
  id?: string
  objectifPoidsFinKg?: number; objectifDureeCycle?: number
  objectifTauxMortaliteMax?: number; objectifICMax?: number
  objectifGainMoyenJour?: number; objectifPrixVenteKg?: number
  objectifMargeNetteMin?: number; notes?: string
  poidsActuelKg?: number; tauxMortaliteActuel?: number
  progressionPct?: number; appreciationPoids?: string
  appreciationMortalite?: string
}   
 
export const fetchVentesBande = (bandeId: string) =>
  apiClient.get<VenteBande[]>(`/api/v1/bandes/${bandeId}/ventes`).then(r => r.data)

export const createVenteBande = (bandeId: string, data: {
  date: string; nombreAnimaux: number; poidsMoyenKg: number
  prixParKg: number; acheteur?: string; observations?: string
}) => apiClient.post<VenteBande>(`/api/v1/bandes/${bandeId}/ventes`, data).then(r => r.data)

export const cloturerBande = (bandeId: string, data: {
  dateSortie: string; motifCloture?: string; effectifVendu?: number
  poidsMoyenKg?: number; prixParKg?: number; acheteur?: string; observations?: string
}) => apiClient.post(`/api/v1/bandes/${bandeId}/cloturer`, data)

export const fetchRentabilite = (bandeId: string) =>
  apiClient.get<RentabiliteData>(`/api/v1/bandes/${bandeId}/rentabilite`).then(r => r.data)

export const fetchObjectif = (bandeId: string) =>
  apiClient.get<ObjectifData>(`/api/v1/bandes/${bandeId}/objectif`).then(r => r.data)

export const saveObjectif = (bandeId: string, data: Partial<ObjectifData>) =>
  apiClient.put<ObjectifData>(`/api/v1/bandes/${bandeId}/objectif`, data).then(r => r.data)