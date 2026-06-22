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