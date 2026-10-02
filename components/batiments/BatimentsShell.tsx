"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar }      from "@/components/dashboard/Sidebar"
import { Topbar }       from "@/components/dashboard/Topbar"
import { DeleteButton } from "@/components/ui/DeleteButton"
import { fetchBatiments, deleteBatiment } from "@/lib/api/batiments"
import { useAuthStore } from "@/lib/store/auth"

const STATUT_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  LIBRE:        { label: "Disponible",   color: "text-green-300",  dot: "bg-green-400" },
  OCCUPE:       { label: "Occupé",       color: "text-blue-300",   dot: "bg-blue-400" },
  NETTOYAGE:    { label: "Nettoyage",    color: "text-amber-300",  dot: "bg-amber-400" },
  MAINTENANCE:  { label: "Maintenance",  color: "text-orange-300", dot: "bg-orange-400" },
  HORS_SERVICE: { label: "Hors service", color: "text-rose-300",   dot: "bg-rose-400" },
}

const TYPE_ICONS: Record<string, string> = {
  poulailler: "🐔", porcherie: "🐷",
  lapiniere: "🐰",  bergerie: "🐑", autre: "🏗",
}

export function BatimentsShell() {
  const router   = useRouter()
  const qc       = useQueryClient()
  const hydrate  = useAuthStore((s) => s.hydrate)
  const token    = useAuthStore((s) => s.token)
  const [ready, setReady]   = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => { hydrate(); setReady(true) }, [hydrate])

  const { data: batiments = [], isLoading } = useQuery({
    queryKey: ["batiments"],
    queryFn:  fetchBatiments,
    enabled:  ready && !!token,
  })

  const filtres = batiments.filter(b =>
    b.nom.toLowerCase().includes(search.toLowerCase()) ||
    (b.fermeNom ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title="Bâtiments"
          subtitle={`${batiments.length} bâtiment${batiments.length > 1 ? "s" : ""}`}
        />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="flex items-center gap-3">
            <input type="text"
              placeholder="Rechercher par nom ou ferme…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10
                         rounded-xl text-sm text-white outline-none
                         placeholder:text-white/20 focus:border-green-400/30"
            />
            <button onClick={() => router.push("/batiments/nouveau")}
              className="px-3 py-2.5 bg-green-400 hover:bg-green-300
                         text-green-950 font-medium rounded-xl text-xs
                         whitespace-nowrap transition-colors">
              + Nouveau bâtiment
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-44 bg-white/[0.03] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtres.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-10 text-center">
              <p className="text-white/40 text-sm mb-2">Aucun bâtiment trouvé.</p>
              <button onClick={() => router.push("/batiments/nouveau")}
                className="text-green-400 text-xs underline hover:text-green-300">
                Créer mon premier bâtiment →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtres.map(bat => {
                const s    = STATUT_LABELS[bat.modeOccupation] ?? STATUT_LABELS.LIBRE
                const icon = TYPE_ICONS[bat.type] ?? TYPE_ICONS.autre
                return (
                  <div key={bat.id}
                    onClick={() => router.push(`/batiments/${bat.id}`)}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5
                               hover:border-white/15 transition-colors cursor-pointer
                               relative group">

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-medium text-white/85">{bat.nom}</p>
                          <p className="text-[11px] text-white/35">{bat.fermeNom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <span className={`text-[10px] ${s.color}`}>{s.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { l: "Capacité",    v: bat.capacite.toLocaleString() },
                        { l: "Salles",      v: bat.nombreSalles ?? 0 },
                        { l: "Disponibles", v: bat.sallesDisponibles ?? "—" },
                      ].map(k => (
                        <div key={k.l}
                          className="bg-white/[0.03] rounded-lg p-2 text-center">
                          <p className="text-sm font-medium text-white">{k.v}</p>
                          <p className="text-[9px] text-white/30 mt-0.5">{k.l}</p>
                        </div>
                      ))}
                    </div>

                    {bat.noteStatut && (
                      <p className="text-[10px] text-amber-300/70 mb-2
                                    bg-amber-400/[0.06] px-2 py-1 rounded-md">
                        ℹ {bat.noteStatut}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-white/30">
                      <span>{bat.surfaceM2 ? `${bat.surfaceM2} m²` : bat.type}</span>
                      <span className="text-green-400/70 opacity-0 group-hover:opacity-100
                                       transition-opacity">Voir →</span>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0
                                    group-hover:opacity-100 transition-opacity"
                      onClick={e => e.stopPropagation()}>
                      <DeleteButton
                        label="✕"
                        confirmMsg="Supprimer ce bâtiment ?"
                        successMsg={`"${bat.nom}" supprimé.`}
                        onDelete={() => deleteBatiment(bat.id)}
                        onSuccess={() => qc.invalidateQueries({ queryKey: ["batiments"] })}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}