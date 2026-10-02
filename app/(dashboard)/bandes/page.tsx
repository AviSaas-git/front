"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sidebar }  from "@/components/dashboard/Sidebar"
import { Topbar }   from "@/components/dashboard/Topbar"
import { fetchBandes } from "@/lib/api/bandes"
import { useAuthStore } from "@/lib/store/auth"

const STATUT_STYLES: Record<string, { label: string; className: string }> = {
  ACTIVE:   { label: "Active",   className: "bg-green-400/10 text-green-300" },
  CLOTUREE: { label: "Clôturée", className: "bg-white/8 text-white/40" },
}

export default function BandesPage() {
  const router = useRouter()
  const hydrate = useAuthStore((s) => s.hydrate)
  const token   = useAuthStore((s) => s.token)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hydrate()
    setReady(true)
  }, [hydrate])

  const { data: bandes = [], isLoading } = useQuery({
    queryKey: ["bandes"],
    queryFn:  fetchBandes,
    enabled:  ready && !!token,
  })

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title="Bandes"
          subtitle={`${bandes.length} bande${bandes.length > 1 ? "s" : ""} enregistrée${bandes.length > 1 ? "s" : ""}`}
        />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="flex justify-end">
            <button
              onClick={() => router.push("/elevages/nouveau")}
              className="px-3 py-1.5 bg-green-400 hover:bg-green-300
                         text-green-950 font-medium rounded-lg text-xs
                         transition-colors"
            >
              + Nouvelle bande
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bandes.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.07]
                            rounded-xl p-10 text-center">
              <p className="text-white/40 text-sm mb-2">Aucune bande encore.</p>
              <button
                onClick={() => router.push("/elevages/nouveau")}
                className="text-green-400 text-xs underline hover:text-green-300"
              >
                Créer ma première bande →
              </button>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.07]
                            rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Référence","Espèce","Bâtiment","Effectif","Âge","Taux mort.","Statut"].map((h) => (
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
                  {bandes.map((b) => {
                    const statut = STATUT_STYLES[b.statut] ?? STATUT_STYLES.ACTIVE
                    const tauxColor = b.tauxMortalite > 3
                      ? "text-rose-400" : "text-white/60"
                    return (
                      <tr
                        key={b.id}
                        onClick={() => router.push(`/bandes/${b.id}`)}
                        className="border-b border-white/[0.04] last:border-0
                                   cursor-pointer hover:bg-white/[0.02]
                                   transition-colors"
                      >
                        <td className="px-3 py-2.5">
                          <p className="text-xs font-mono text-white/80">
                            {b.especeIcon} {b.reference}
                          </p>
                          {b.race && (
                            <p className="text-[10px] text-white/35">{b.race}</p>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-white/50">
                          {b.especeNom}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-white/50">
                          {b.batimentNom}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-white/70">
                          {b.effectifActuel.toLocaleString()}
                          <span className="text-white/30">
                            /{b.effectifInitial.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-white/50">
                          J+{b.ageEnJours}
                        </td>
                        <td className={`px-3 py-2.5 text-xs font-medium ${tauxColor}`}>
                          {b.tauxMortalite.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5
                                           rounded-full ${statut.className}`}>
                            {statut.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}