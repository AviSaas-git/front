"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchAnimaux } from "@/lib/api/animaux"

const SEXE_LABELS: Record<string, string> = {
  MALE: "Mâle", FEMELLE: "Femelle", INDETERMINE: "INDETERMINE"
}
const STATUT_STYLES: Record<string, string> = {
  ACTIF:        "bg-green-400/10 text-green-300",
  REPRODUCTEUR: "bg-violet-400/10 text-violet-300",
  VENDU:        "bg-white/8 text-white/40",
  MORT:         "bg-rose-400/10 text-rose-300",
}

export function AnimauxShell() {
  const router = useRouter()
  const [ready, setReady]   = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setReady(!!localStorage.getItem("avisaas_token"))
  }, [])

  const { data: animaux = [], isLoading } = useQuery({
    queryKey: ["animaux"],
    queryFn:  fetchAnimaux,
    enabled:  ready,
  })

  const filtres = animaux.filter((a) =>
    a.numero.toLowerCase().includes(search.toLowerCase()) ||
    (a.nom ?? "").toLowerCase().includes(search.toLowerCase()) ||
    a.especeNom.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Animaux" subtitle={`${animaux.length} animaux enregistrés`} />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Rechercher par numéro, nom, espèce…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10
                       rounded-xl text-sm text-white outline-none
                       placeholder:text-white/20 focus:border-green-400/30"
          />

          {!ready || isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtres.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl
                            p-8 text-center">
              <p className="text-white/40 text-sm">Aucun animal trouvé</p>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.07]
                            rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Numéro / Nom","Espèce","Sexe","Âge","Bâtiment","Statut"].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 text-[10px] font-medium
                                             text-white/25 border-b border-white/[0.06]
                                             whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtres.map((a) => (
                    <tr key={a.id}
                      onClick={() => router.push(`/animaux/${a.id}`)}
                      className="border-b border-white/[0.04] last:border-0
                                 cursor-pointer hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-2.5">
                        <p className="font-mono text-xs text-white/80">{a.especeIcon} {a.numero}</p>
                        {a.nom && <p className="text-[10px] text-white/40">{a.nom}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-white/50">{a.especeNom}</td>
                      <td className="px-3 py-2.5 text-xs text-white/50">
                        {SEXE_LABELS[a.sexe] ?? a.sexe}
                        {a.sexe === "INDETERMINE" && (
                          <span className="ml-1 text-[9px] text-amber-400">⚠</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-white/50">{a.ageEnMois} mois</td>
                      <td className="px-3 py-2.5 text-xs text-white/50">{a.batimentNom}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                                         ${STATUT_STYLES[a.statut] ?? "bg-white/8 text-white/40"}`}>
                          {a.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}