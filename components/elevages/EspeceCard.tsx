import type { EspeceConfig } from "@/lib/types/elevage"
import { useEffect, useState } from "react"

type Props = {
  espece:     EspeceConfig
  selected:   boolean
  onClick:    () => void
}

export function EspeceCard({ espece, selected, onClick }: Props) {
  const isLot = espece.modeGestion === "LOT"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-3.5
                  transition-all duration-150
                  ${selected
                    ? "border-green-400/35 bg-green-400/[0.04]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/16"
                  }`}
    >
      <div className="text-2xl mb-2">{espece.icon}</div>

      <p className="text-xs font-medium text-white mb-1.5">
        {espece.nom}
      </p>

      <span className={`inline-block text-[10px] font-medium
                        px-2 py-0.5 rounded-full
                        ${isLot
                          ? "bg-blue-400/10 text-blue-300"
                          : "bg-violet-400/10 text-violet-300"
                        }`}>
        {espece.modeGestion}
      </span>

      <p className="text-[10px] text-white/30 mt-1.5">
        {espece.cycleMoyenJours
          ? `Cycle : ${espece.cycleMoyenJours}j`
          : espece.dureeGestationJours
          ? `Gestation : ${espece.dureeGestationJours}j`
          : "Cycle illimité"}
      </p>
    </button>
  )
}