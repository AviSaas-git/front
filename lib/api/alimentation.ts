import { apiClient } from "./client"

export type IngredientData = {
  id:              string
  nom:             string
  unite:           string | null
  prixUnitaireKg:  number
  fournisseur:     string | null
  description:     string | null
}

export type LigneFormula = {
  ingredientId:        string
  ingredientNom:       string
  ingredientUnite:     string | null
  proportionPour100kg: number
  prixIngredientKg:    number
  coutContribution:    number
  observations:        string | null
}

export type FormulaData = {
  id:               string
  nom:              string
  description:      string | null
  especeNom:        string | null
  phase:            string
  prixRevientKg:    number
  proportionTotale: number
  composition:      LigneFormula[]
}

export type ConsommationEntry = {
  id:                   string
  date:                 string
  formulaNom:           string
  quantiteKg:           number
  prixRevientKgMoment:  number
  coutTotal:            number
  observations:         string | null
}

export type AlimentationBande = {
  totalKgConsommes:        number
  coutTotalAlimentation:   number
  coutParKgVifMoyen:       number
  consommationParOiseauKg: number
  coutParFormule:          Record<string, number>
  historique:              ConsommationEntry[]
}

export async function fetchIngredients(): Promise<IngredientData[]> {
  const res = await apiClient.get<IngredientData[]>("/api/v1/ingredients")
  return res.data
}

export async function createIngredient(data: {
  nom: string; unite?: string; prixUnitaireKg: number
  fournisseur?: string; description?: string
}): Promise<IngredientData> {
  const res = await apiClient.post("/api/v1/ingredients", data)
  return res.data
}

export async function enregistrerAchat(ingredientId: string, data: {
  date: string; quantiteKg: number; prixUnitaireKg: number
  fournisseur?: string; observations?: string
}): Promise<IngredientData> {
  const res = await apiClient.post(`/api/v1/ingredients/${ingredientId}/achats`, data)
  return res.data
}

export async function fetchFormulas(): Promise<FormulaData[]> {
  const res = await apiClient.get<FormulaData[]>("/api/v1/formulas")
  return res.data
}

export async function createFormula(data: {
  nom: string; description?: string; especeId?: string; phase?: string
  composition: { ingredientId: string; proportionPour100kg: number; observations?: string }[]
}): Promise<FormulaData> {
  const res = await apiClient.post("/api/v1/formulas", data)
  return res.data
}

export async function fetchAlimentation(bandeId: string): Promise<AlimentationBande> {
  const res = await apiClient.get<AlimentationBande>(`/api/v1/bandes/${bandeId}/alimentation`)
  return res.data
}

export async function createConsommation(bandeId: string, data: {
  date: string; formulaId: string; quantiteKg: number; observations?: string
}): Promise<ConsommationEntry> {
  const res = await apiClient.post(`/api/v1/bandes/${bandeId}/alimentation`, data)
  return res.data
}

export async function fetchAlimentationAnimal(animalId: string): Promise<AlimentationBande> {
  const res = await apiClient.get<AlimentationBande>(`/api/v1/animaux/${animalId}/alimentation`)
  return res.data
}

export async function createConsommationAnimal(animalId: string, data: {
      date: string; 
      formulaId: string; 
      quantiteKg: number; 
      observations?: string
}): Promise<ConsommationEntry> {
    console.log("Données envoyées à l'API :", data)
  
  const res = await apiClient.post(`/api/v1/animaux/${animalId}/alimentation`, data)
  return res.data
}

export async function updateIngredient(id: string, data: Partial<{
  nom: string; unite: string; prixUnitaireKg: number; fournisseur: string; actif: boolean
}>): Promise<IngredientData> {
  const res = await apiClient.patch<IngredientData>(`/api/v1/ingredients/${id}`, data)
  return res.data
}

export async function deleteIngredient(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/ingredients/${id}`)
}

export async function deleteFormula(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/formulas/${id}`)
}

export async function deleteConsommation(bandeId: string, id: string): Promise<void> {
  await apiClient.delete(`/api/v1/bandes/${bandeId}/alimentation/${id}`)
}