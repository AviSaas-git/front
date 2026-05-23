import { apiClient }  from "./client"
import type { BandeFormData, AnimalFormData } from "@/lib/types/elevage"

export type ElevageCreated = {
  id:        string
  reference: string
  mode:      "LOT" | "INDIVIDUEL"
  message:   string
}

// Un seul endpoint — Spring Boot route selon le mode de l'espèce
export async function demarrerElevage(

  data: BandeFormData | AnimalFormData
): Promise<ElevageCreated> {
   //console.log(data)
  const res = await apiClient.post<ElevageCreated>(
    "/api/v1/elevages/demarrer",
    data

   
  )
  return res.data
}

export async function listerElevages(): Promise<ElevageCreated[]> {
  const res = await apiClient.get<ElevageCreated[]>("/api/v1/elevages")
  return res.data
}