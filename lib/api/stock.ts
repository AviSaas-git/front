import { apiClient } from "./client"

export type StockItemData = {
  id: string; nom: string; categorie: string; unite: string | null
  quantiteActuelle: number; seuilAlerte: number
  prixUnitaire: number; fournisseur: string | null; enAlerte: boolean
}

export const fetchStockItems = () =>
  apiClient.get<StockItemData[]>("/api/v1/stock").then(r => r.data)

export const createStockItem = (data: object) =>
  apiClient.post<StockItemData>("/api/v1/stock", data).then(r => r.data)

export const enregistrerMouvement = (itemId: string, data: object) =>
  apiClient.post<StockItemData>(`/api/v1/stock/${itemId}/mouvements`, data).then(r => r.data)