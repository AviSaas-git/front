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