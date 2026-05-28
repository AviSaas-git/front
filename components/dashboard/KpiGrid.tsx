import { KpiCard } from "./KpiCard"
import type { KpiItem } from "@/lib/types/dashboard"

type Props = {
  totalBandes:   number
  totalAnimaux:  number
  totalFermes:   number
  totalBatiments: number
}

export function KpiGrid({ totalBandes, totalAnimaux, totalFermes, totalBatiments }: Props) {
  const kpis: KpiItem[] = [
    {
      label:    "Bandes actives",
      value:    String(totalBandes),
      sub:      totalBandes === 0 ? "Aucune bande" : "en production",
      subColor: totalBandes > 0 ? "text-green-400" : "text-white/30",
    },
    {
      label:    "Animaux suivis",
      value:    String(totalAnimaux),
      sub:      "mode individuel",
      subColor: "text-white/30",
    },
    {
      label:    "Fermes",
      value:    String(totalFermes),
      sub:      totalFermes > 0 ? "configurées ✓" : "Créez votre ferme",
      subColor: totalFermes > 0 ? "text-green-400" : "text-white/30",
    },
    {
      label:    "Bâtiments",
      value:    String(totalBatiments),
      sub:      totalBatiments > 0 ? "opérationnels ✓" : "Aucun bâtiment",
      subColor: totalBatiments > 0 ? "text-green-400" : "text-white/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}