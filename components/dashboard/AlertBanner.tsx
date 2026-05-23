import { ALERTS } from "@/lib/constants/dashboard"

export function AlertBanner() {
  if (ALERTS.length === 0) return null

  return (
    <div className="flex items-center gap-3 bg-amber-400/[0.06]
                    border border-amber-400/[0.12] rounded-xl
                    px-4 py-2.5">
      <div className="w-5 h-5 rounded-full bg-amber-400/15
                      flex items-center justify-center
                      text-amber-400 text-xs flex-shrink-0">
        ⚠
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-amber-300">
          {ALERTS.length} alerte{ALERTS.length > 1 ? "s" : ""} active{ALERTS.length > 1 ? "s" : ""}
        </span>
        <span className="text-xs text-white/30 ml-2">
          — {ALERTS.map((a) => a.message).join(" · ")}
        </span>
      </div>
      <button className="text-xs text-amber-400/70
                         hover:text-amber-400 transition-colors
                         whitespace-nowrap flex-shrink-0">
        Voir →
      </button>
    </div>
  )
}