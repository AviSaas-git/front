import { PROG_COLOR } from "@/lib/constants/dashboard"
import type { StatutElevage } from "@/lib/types/dashboard"

type Props = {
  value:  number
  statut: StatutElevage
}

export function ProgressCell({ value, statut }: Props) {
  const color = PROG_COLOR[statut] ?? "bg-white/20"

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] text-white/25">{value}%</span>
    </div>
  )
}