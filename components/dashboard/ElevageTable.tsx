"use client"

import { useQuery }      from "@tanstack/react-query"
import { useState }      from "react"
import { ProgressCell }  from "./ProgressCell"
import { fetchBandes }   from "@/lib/api/bandes"
import { STATUT_STYLES, MODE_STYLES } from "@/lib/constants/dashboard"

export function ElevageTable() {
  const { data: bandes = [], isLoading } = useQuery({
    queryKey: ["bandes"],
    queryFn:  fetchBandes,
    staleTime: 30_000,
  })

  const [selected, setSelected] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i}
            className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (bandes.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.07]
                      rounded-xl p-8 text-center">
        <p className="text-white/40 text-sm mb-2">Aucun élevage en cours</p>
        <p className="text-white/20 text-xs">
          Cliquez sur "+ Nouvel élevage" pour commencer
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-white/50">
          Élevages en cours — {bandes.length} actif{bandes.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.07]
                      rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Référence","Espèce","Mode","Statut","Info clé","Progression"].map((h) => (
                <th key={h}
                  className="text-left px-3 py-2.5 text-[10px] font-medium
                             text-white/25 border-b border-white/[0.06]
                             whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bandes.map((bande) => {
              const isSelected = selected === bande.id
              const statut = STATUT_STYLES[bande.statut] ?? {
                label: bande.statut,
                className: "bg-white/8 text-white/40"
              }
              const mode = MODE_STYLES[bande.especeMode]

              return (
                <tr
                  key={bande.id}
                  onClick={() => setSelected(bande.id)}
                  className={`border-b border-white/[0.04] last:border-0
                              cursor-pointer transition-colors
                              ${isSelected
                                ? "bg-green-400/[0.03]"
                                : "hover:bg-white/[0.02]"}`}
                >
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-white/80">
                      {bande.especeIcon} {bande.reference}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-white/50">
                    {bande.especeNom}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full ${mode?.className}`}>
                      {bande.especeMode}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full ${statut.className}`}>
                      {statut.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-white/40
                                 whitespace-nowrap">
                    {bande.effectifActuel.toLocaleString()} · J+{bande.ageEnJours}
                  </td>
                  <td className="px-3 py-2.5">
                    <ProgressCell
                      value={bande.progressionPct}
                      statut={bande.statut as any}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}