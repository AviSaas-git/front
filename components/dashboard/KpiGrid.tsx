import { KpiCard } from "./KpiCard"
import { KPIS }   from "@/lib/constants/dashboard"

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}