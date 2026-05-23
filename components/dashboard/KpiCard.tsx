import type { KpiItem } from "@/lib/types/dashboard"

type Props = { kpi: KpiItem }

export function KpiCard({ kpi }: Props) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07]
                    rounded-xl p-4">
      <p className="text-[10px] text-white/40 mb-1.5">
        {kpi.label}
      </p>
      <p className={`text-2xl font-medium leading-none
                     ${kpi.valueColor ?? "text-white"}`}>
        {kpi.value}
      </p>
      <p className={`text-[10px] mt-1.5 ${kpi.subColor}`}>
        {kpi.sub}
      </p>
    </div>
  )
}