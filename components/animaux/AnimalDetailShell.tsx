"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchAnimalById, updateSexe } from "@/lib/api/animaux"

type Props = { animalId: string }

export function AnimalDetailShell({ animalId }: Props) {
  const router = useRouter()
  const qc = useQueryClient()
  const [ready, setReady]     = useState(false)
  const [sexeLoading, setSexeLoading] = useState(false)

  useEffect(() => {
    setReady(!!localStorage.getItem("avisaas_token"))
  }, [])

  const { data: animal, isLoading } = useQuery({
    queryKey: ["animal", animalId],
    queryFn:  () => fetchAnimalById(animalId),
    enabled:  ready,
  })

  async function handleSexe(sexe: "MALE" | "FEMELLE" | "INDETERMINE") {
    setSexeLoading(true)
    try {
      await updateSexe(animalId, sexe)
      qc.invalidateQueries({ queryKey: ["animal", animalId] })
      qc.invalidateQueries({ queryKey: ["animaux"] })
    } finally {
      setSexeLoading(false)
    }
  }

  if (!ready || isLoading || !animal) {
    return (
      <div className="flex h-screen bg-[#09090b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/30 text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={`${animal.especeIcon} ${animal.numero}`}
          subtitle={animal.nom ?? animal.especeNom}
        />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <button onClick={() => router.back()}
            className="text-xs text-white/40 hover:text-white/70
                       transition-colors self-start flex items-center gap-1">
            ← Retour
          </button>

          {/* Alerte sexage en attente */}
          {animal.sexe === "INDETERMINE" && (
            <div className="flex items-center justify-between
                            bg-amber-400/[0.07] border border-amber-400/[0.18]
                            rounded-xl px-4 py-3">
              <p className="text-xs text-amber-300">
                ⚠ Sexe à déterminer — Cet animal est né récemment.
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleSexe("MALE")} disabled={sexeLoading}
                  className="text-[11px] px-3 py-1 bg-blue-400/10 hover:bg-blue-400/20
                             text-blue-300 rounded-lg transition-colors">
                  Mâle
                </button>
                <button onClick={() => handleSexe("FEMELLE")} disabled={sexeLoading}
                  className="text-[11px] px-3 py-1 bg-rose-400/10 hover:bg-rose-400/20
                             text-rose-300 rounded-lg transition-colors">
                  Femelle
                </button>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Sexe", value: animal.sexe === "MALE" ? "Mâle" : animal.sexe === "FEMELLE" ? "Femelle" : "—", color: "text-white" },
              { label: "Âge", value: `${animal.ageEnMois} mois`, color: "text-white" },
              { label: "Poids actuel", value: animal.poidsActuelKg ? `${animal.poidsActuelKg} kg` : "—", color: "text-white" },
              { label: "Statut", value: animal.statut, color: "text-green-400" },
            ].map((k) => (
              <div key={k.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[10px] text-white/40 mb-1.5">{k.label}</p>
                <p className={`text-xl font-medium ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Infos principales */}
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-medium text-white mb-4">Informations</h2>
            <div className="grid grid-cols-2 gap-y-3">
              {[
                ["Numéro",        animal.numero],
                ["Nom",           animal.nom ?? "—"],
                ["Espèce",        `${animal.especeIcon} ${animal.especeNom}`],
                ["Bâtiment",      animal.batimentNom],
                ["Naissance",     new Date(animal.dateNaissance).toLocaleDateString("fr-FR")],
                ["Origine",       animal.origine === "ACHAT" ? "Achat externe" : "Naissance en ferme"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-white/30 mb-0.5">{l}</p>
                  <p className="text-xs text-white/80">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Généalogie */}
          {(animal.pereNumero || animal.mereNumero || animal.consanguin) && (
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
              <h2 className="text-sm font-medium text-white mb-4">Généalogie</h2>

              {animal.consanguin && (
                <div className="bg-amber-400/[0.08] border border-amber-400/20
                                rounded-lg px-3 py-2 text-xs text-amber-300 mb-3">
                  ⚠ Risque de consanguinité détecté
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/30 mb-1">Père</p>
                  {animal.pereNumero ? (
                    <p className="text-xs font-mono text-white/70">{animal.pereNumero}</p>
                  ) : (
                    <p className="text-xs text-white/30">Inconnu</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">Mère</p>
                  {animal.mereNumero ? (
                    <p className="text-xs font-mono text-white/70">{animal.mereNumero}</p>
                  ) : (
                    <p className="text-xs text-white/30">Inconnue</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}