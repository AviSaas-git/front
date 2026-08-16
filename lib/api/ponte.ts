import { apiClient } from "./client"

export type CollecteEntry = {
  id: string
  date: string
  ageEnJours: number
  oeufsPetit: number
  oeufsMovyen: number
  oeufsGros: number
  oeufsSupGros: number
  oeufsCasses: number
  oeufsDeclasses: number
  totalCommercialisables: number
  totalCollectes: number
  tauxPonte: number
  tauxCasse: number
  conditionnement: {
    alveolesPetit: number; restesPetit: number
    alveolesMovyen: number; restesMovyen: number
    alveolesGros: number; restesGros: number
    alveolesSupGros: number; restesSupGros: number
    totalAlveoles: number
    cartonsPossibles: number
    alveolesRestantes: number
  }
  observations: string | null
}

export type StockCalibreDetail = {
  quantite: number; alveoles: number
  alveolesPleines: number; resteOeufs: number
  cartons: number; ageMoyenJours: number; alerteDlc: boolean
}

export type StockOeufsData = {
  parCalibre: Record<string, StockCalibreDetail>
  totalOeufs: number; totalAlveoles: number; totalCartons: number
  alerteDlc: boolean; nombreLotsExpires: number
}

export type VenteEntry = {
  id: string; date: string; client: string | null
  telephone: string | null; montantTotal: number
  lignes: {
    calibre: string; nombreOeufs: number; nombreAlveoles: number
    prixAlveole: number; montantLigne: number
  }[]
  observations: string | null
}

export type PonteDashboard = {
  totalOeufsProduitsTotal: number
  tauxPonteMoyen: number; tauxCasseMoyen: number
  recettesTotales: number
  stockActuel: StockOeufsData
  ponteAujourdhui: CollecteEntry | null
  courbe30j: { date: string; oeufsTotal: number | null; tauxPonte: number | null }[]
  repartitionCalibresPct: Record<string, number>
  dernieresVentes: VenteEntry[]
}

export const fetchCollectes = (b: string) =>
  apiClient.get<CollecteEntry[]>(`/api/v1/bandes/${b}/collectes`).then(r => r.data)

export const createCollecte = (b: string, data: object) =>
  apiClient.post<CollecteEntry>(`/api/v1/bandes/${b}/collectes`, data).then(r => r.data)

export const fetchVentes = (b: string) =>
  apiClient.get<VenteEntry[]>(`/api/v1/bandes/${b}/ventes-oeufs`).then(r => r.data)

export const createVente = (b: string, data: object) =>
  apiClient.post<VenteEntry>(`/api/v1/bandes/${b}/ventes-oeufs`, data).then(r => r.data)

export const fetchStock = (b: string) =>
  apiClient.get<StockOeufsData>(`/api/v1/bandes/${b}/stock-oeufs`).then(r => r.data)

export const fetchPonteDashboard = (b: string) =>
  apiClient.get<PonteDashboard>(`/api/v1/bandes/${b}/ponte-dashboard`).then(r => r.data)

export const fetchPrixReference = () =>
  apiClient.get<Record<string, number>>("/api/v1/ponte/prix-reference").then(r => r.data)

export const updatePrixReference = (prix: Record<string, number>) =>
  apiClient.put("/api/v1/ponte/prix-reference", { prix })