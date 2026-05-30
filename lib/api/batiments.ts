import { apiClient } from "./client"
import type { BatimentFormData } from "@/lib/types/forms"

export type Batiment = {
  id:            string
  fermeId:       string
  nom:           string
  capacite:      number
  surfaceM2?:    number
  typeChauffage?: string
  type:          string
}

export type BatimentData = {
  id:       string
  nom:      string
  capacite: number
  type:     string
  fermeId:  string
}

export async function creerBatiment(
  fermeId: string,
  tenantId: string, //
  data: BatimentFormData
): Promise<Batiment> {
  const res = await apiClient.post<Batiment>(
    "/api/v1/batiments",
    { 
      ...data, 
      fermeId, 
      tenantId // 💡 Lié ici à l'objet final envoyé au backend Spring Boot
    }
  )

  console.log(res)
  return res.data
}

export async function listerBatiments(fermeId: string): Promise<Batiment[]> {
  const res = await apiClient.get<Batiment[]>(
    `/api/v1/batiments?fermeId=${fermeId}`
  )
  return res.data
}

export async function fetchBatiments(): Promise<BatimentData[]> {
  const res = await apiClient.get<BatimentData[]>("/api/v1/batiments")

  console.log(" res batiment : "+ res)
  return res.data
}