import { apiClient } from "./client"

export type AnimalData = {
  id:            string
  numero:        string
  nom:           string
  sexe:          "MALE" | "FEMELLE" | "INDETERMINE"
  dateNaissance: string
  ageEnMois:     number
  origine:       string
  statut:        string
  poidsActuelKg: number | null
  consanguin:    boolean
  especeNom:     string
  especeIcon:    string
  batimentNom:   string
  pereNumero:    string | null
  mereNumero:    string | null
}

export type ReproducteurOption = {
  id:     string
  numero: string
  nom:    string | null
}

export async function fetchAnimaux(): Promise<AnimalData[]> {
  const res = await apiClient.get<AnimalData[]>("/api/v1/animaux")
  return res.data
}

export async function fetchReproducteurs(
  especeId: string,
  sexe: "MALE" | "FEMELLE"
): Promise<AnimalData[]> {
  const res = await apiClient.get(
    `/api/v1/animaux/reproducteurs?especeId=${especeId}&sexe=${sexe}`
  )
  return res.data
}

export async function createAnimal(data: {
  especeId:       string
  batimentId:     string
  numero:         string
  nom?:           string
  sexe:           string
  dateNaissance:  string
  origine:        string
  poidsActuelKg?: number
  pereId?:        string
  mereId?:        string
}): Promise<AnimalData> {
  const res = await apiClient.post<AnimalData>("/api/v1/animaux", data)
  return res.data
}
export async function fetchAnimalById(id: string): Promise<AnimalData> {
  const res = await apiClient.get<AnimalData>(`/api/v1/animaux/${id}`)
  return res.data
}

export async function updateSexe(id: string, sexe: "MALE" | "FEMELLE" |"INDETERMINE"): Promise<AnimalData> {
  const res = await apiClient.patch(`/api/v1/animaux/${id}/sexe`, { sexe })
  return res.data
}

// consomation 
export type ConsommationEntry = {
  id: string; date: string; typeAliment: string
  quantiteKg: number; prixParKgFcfa: number
  montantFcfa: number; observations: string | null
}

export type EvenementEntry = {
  id: string; date: string; type: string
  poidsKg: number | null; traitement: string | null
  laboratoire: string | null; dosage: string | null
  voieAdministration: string | null; cause: string | null
  observations: string | null
}

export async function fetchEvenementsAnimal(id: string): Promise<EvenementEntry[]> {
  const res = await apiClient.get<EvenementEntry[]>(`/api/v1/animaux/${id}/evenements`)
  return res.data
}
export async function fetchConsommationAnimal(animalId: string) {
  const res = await apiClient.get(
    `/api/v1/animaux/${animalId}/consommations`
  )

  return res.data
}
export async function createEvenementAnimal(id: string, data: {
  date: string; type: string; poidsKg?: number
  traitement?: string; laboratoire?: string; dosage?: string
  voieAdministration?: string; cause?: string; observations?: string
}): Promise<EvenementEntry> {
  const res = await apiClient.post(`/api/v1/animaux/${id}/evenements`, data)
  return res.data
}

export async function updateAnimal(id: string, data: Partial<{
  nom: string; sexe: string; statut: string
  poidsActuelKg: number; batimentId: string
}>): Promise<AnimalData> {
  const res = await apiClient.patch<AnimalData>(`/api/v1/animaux/${id}`, data)
  return res.data
}

export async function deleteAnimal(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/animaux/${id}`)
}