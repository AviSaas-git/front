"use client"

import { useState }       from "react"
import { useRouter }      from "next/navigation"
import { ProgressCell }   from "./ProgressCell"
import {
  ELEVAGES,
  STATUT_STYLES,
  MODE_STYLES,
} from "@/lib/constants/dashboard"
import type { ElevageRow } from "@/lib/types/dashboard"

export function ElevageTable() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(ELEVAGES[0].id)

  function handleRowClick(row: ElevageRow) {
    setSelected(row.id)
    // Plus tard → router.push(`/elevages/${row.id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-white/50">
          Élevages en cours
        </p>
        <button className="text-xs text-white/30 hover:text-white/60
                           transition-colors">
          Voir tout →
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.07]
                      rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Référence","Espèce","Mode","Statut","Info clé","Progression",""].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2.5 text-[10px]
                             font-medium text-white/25 border-b
                             border-white/[0.06] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ELEVAGES.map((row) => {
              const isSelected = selected === row.id
              const statut     = STATUT_STYLES[row.statut]
              const mode       = MODE_STYLES[row.mode]

              return (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className={`border-b border-white/[0.04] last:border-0
                              cursor-pointer transition-colors
                              ${isSelected
                                ? "bg-green-400/[0.03]"
                                : "hover:bg-white/[0.02]"
                              }`}
                >
                  {/* Référence */}
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-white/80">
                      {row.reference}
                    </span>
                  </td>

                  {/* Espèce */}
                  <td className="px-3 py-2.5 text-xs text-white/50">
                    {row.espece}
                  </td>

                  {/* Mode */}
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full ${mode.className}`}>
                      {row.mode}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full ${statut.className}`}>
                      {statut.label}
                    </span>
                  </td>

                  {/* Info clé */}
                  <td className="px-3 py-2.5 text-[11px] text-white/40
                                 whitespace-nowrap">
                    {row.infoKey}
                  </td>

                  {/* Progression */}
                  <td className="px-3 py-2.5">
                    <ProgressCell
                      value={row.progression}
                      statut={row.statut}
                    />
                  </td>

                  {/* Flèche */}
                  <td className="px-3 py-2.5 text-right text-white/20
                                 text-xs">
                    ›
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