import { apiClient } from "./client"

export type DashboardData = {
  totalBandesActives:      number
  totalAnimauxIndividuels: number
  totalFermes:             number
  totalBatiments:          number
  fermes: {
    id:           string
    nom:          string
    localisation: string
    capaciteMax:  number
  }[]
  batiments: {
    id:       string
    nom:      string
    capacite: number
    type:     string
    fermeId:  string
  }[]
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await apiClient.get<DashboardData>("/api/v1/dashboard")
  return res.data
}