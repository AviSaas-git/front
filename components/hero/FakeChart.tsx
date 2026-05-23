"use client"

import { CHART_DATA } from "@/lib/constants/landing"

export function FakeChart() {
  const max = Math.max(...CHART_DATA)

  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-4">
      <p className="text-[10px] text-white/40 mb-3">
        Évolution poids moyen (g) — BAND-2025-012
      </p>
      <div className="flex items-end gap-1 h-14">
        {CHART_DATA.map((val, i) => {
          const height = Math.round((val / max) * 100)
          const isRecent = i >= CHART_DATA.length - 4
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm transition-all ${
                isRecent ? "bg-green-400" : "bg-green-400/30"
              }`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[9px] text-white/30">J1</span>
        <span className="text-[9px] text-white/30">J38</span>
      </div>
    </div>
  )
}