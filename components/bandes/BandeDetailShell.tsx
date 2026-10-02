"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchBandeDetail, fetchMortalites, fetchProphylaxies } from "@/lib/api/bandes"
import { MortaliteForm }     from "./MortaliteForm"
import { MortaliteHistory }  from "./MortaliteHistory"
import { ProphylaxieForm }   from "./ProphylaxieForm"
import { ProphylaxieHistory } from "./ProphylaxieHistory"

import { fetchPesees, fetchCourbeCroissance } from "@/lib/api/pesees"
import { PeseeForm }              from "./PeseeForm"
import { PeseeHistory }           from "./PeseeHistory"
import { CourbeCroissanceChart }  from "./CourbeCroissanceChart"

import { FinancesDashboard } from "./FinancesDashboard"


import { createConsommationBande, fetchConsommationBande } from "@/lib/api/bandes"
import { ConsommationForm } from "./ConsommationForm"


import { AlimentationBandePanel } from "../alimentation/AlimentationBandePanel"

import { PontePanel } from "./PontePanel"
//
import { VenteForm }           from "./VenteForm"
import { RentabilitePanel }    from "./RentabilitePanel"
import { ObjectifPanel }       from "./ObjectifPanel"
import { ClotureBandeModal }   from "./ClotureBandeModal"


type Props = { bandeId: string }

type Tab = "mortalite" | "prophylaxie" | "pesee" | "finances"
         | "alimentation" | "ponte" | "ventes" | "rentabilite" | "objectifs"

export function BandeDetailShell({ bandeId }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const qc     = useQueryClient()
  const [ready, setReady] = useState(false)
  const [tab, setTab]     = useState<Tab>("mortalite")
  const [showCloture, setShowCloture] = useState(false)


  useEffect(() => {
    setReady(!!localStorage.getItem("avisaas_token"))
  }, [])
  const { data: consommationsBande = [] } = useQuery({
    queryKey: ["consommation-bande", bandeId],
    queryFn:  () => fetchConsommationBande(bandeId),
    enabled:  ready,
  })
  const { data: bande, isLoading } = useQuery({
    queryKey: ["bande", bandeId],
    queryFn:  () => fetchBandeDetail(bandeId),
    enabled:  ready,
  })

  const { data: mortalites = [] } = useQuery({
    queryKey: ["mortalites", bandeId],
    queryFn:  () => fetchMortalites(bandeId),
    enabled:  ready,
  })

  const { data: prophylaxies = [] } = useQuery({
    queryKey: ["prophylaxies", bandeId],
    queryFn:  () => fetchProphylaxies(bandeId),
    enabled:  ready,
  })
  const { data: pesees = [] } = useQuery({
    queryKey: ["pesees", bandeId],
    queryFn:  () => fetchPesees(bandeId),
    enabled:  ready,
  })

  const { data: courbe = [] } = useQuery({
  queryKey: ["courbe", bandeId],
  queryFn:  () => fetchCourbeCroissance(bandeId),
  enabled:  ready,
})
  function invalidateAll() {
    qc.invalidateQueries({ queryKey: ["bande", bandeId] })
    qc.invalidateQueries({ queryKey: ["mortalites", bandeId] })
    qc.invalidateQueries({ queryKey: ["prophylaxies", bandeId] })
    qc.invalidateQueries({ queryKey: ["bandes"] })
    qc.invalidateQueries({ queryKey: ["dashboard"] })
    qc.invalidateQueries({ queryKey: ["pesees", bandeId] })
    qc.invalidateQueries({ queryKey: ["courbe", bandeId] })
    qc.invalidateQueries({ queryKey: ["consommation-bande", bandeId] })
  }

  if (!ready || isLoading || !bande) {
    return (
      <div className="flex h-screen bg-[#09090b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/30 text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  const tauxColor = bande.tauxMortalite > 4 ? "text-rose-400" : "text-green-400"

  const estPondeuse = bande.especeNom.toLowerCase().includes("pondeuse")


  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={`${bande.especeIcon} ${bande.reference}`}
          subtitle={`${bande.especeNom} · ${bande.batimentNom}`}
        />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <button onClick={() => router.push("/dashboard")}
            className="text-xs text-white/40 hover:text-white/70 transition-colors
                       self-start flex items-center gap-1">
            ← Retour au tableau de bord
          </button>
          <a href={`/especes/${bande.especeId}/courbe`}
            className="text-xs text-blue-400 hover:text-blue-300
                      transition-colors self-start flex items-center gap-1">
            ⚙ Configurer la courbe de référence {bande.especeNom} →
          </a>
          {bande.statut === "ACTIVE" && (
              <button onClick={() => setShowCloture(true)}
                className="px-3 py-1.5 bg-rose-400/10 hover:bg-rose-400/20
                          text-rose-300 rounded-lg text-xs transition-colors
                          self-start">
                🔒 Clôturer la bande
              </button>
            )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1.5">Effectif actuel</p>
              <p className="text-2xl font-medium text-white">{bande.effectifActuel.toLocaleString()}</p>
              <p className="text-[10px] text-white/30 mt-1.5">sur {bande.effectifInitial.toLocaleString()}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1.5">Taux mortalité</p>
              <p className={`text-2xl font-medium ${tauxColor}`}>{bande.tauxMortalite.toFixed(1)}%</p>
              <p className="text-[10px] text-white/30 mt-1.5">seuil alerte : 3%</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1.5">Âge</p>
              <p className="text-2xl font-medium text-white">{bande.ageEnJours}j</p>
              <p className="text-[10px] text-white/30 mt-1.5">depuis arrivée</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1.5">Progression cycle</p>
              <p className="text-2xl font-medium text-white">{bande.progressionPct}%</p>
              <p className="text-[10px] text-white/30 mt-1.5">{bande.statut}</p>
            </div>
          </div>

          <div className="flex gap-1 border-b border-white/[0.07]">
            <button onClick={() => setTab("mortalite")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                          ${tab === "mortalite"
                            ? "text-rose-400 border-rose-400"
                            : "text-white/40 border-transparent hover:text-white/60"}`}>
              Mortalité
            </button>
            <button onClick={() => setTab("prophylaxie")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                          ${tab === "prophylaxie"
                            ? "text-blue-400 border-blue-400"
                            : "text-white/40 border-transparent hover:text-white/60"}`}>
              Prophylaxie · {prophylaxies.length}
            </button>

            <button onClick={() => setTab("pesee")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                          ${tab === "pesee"
                            ? "text-green-400 border-green-400"
                            : "text-white/40 border-transparent hover:text-white/60"}`}>
              Pesée
            </button>
            <button onClick={() => setTab("finances")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                          ${tab === "finances"
                            ? "text-yellow-400 border-yellow-400"
                            : "text-white/40 border-transparent hover:text-white/60"}`}>
              Finances
            </button>
                          <button onClick={() => setTab("ventes")}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                            ${tab === "ventes"
                              ? "text-green-400 border-green-400"
                              : "text-white/40 border-transparent hover:text-white/60"}`}>
                Ventes
              </button>
              <button onClick={() => setTab("rentabilite")}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                            ${tab === "rentabilite"
                              ? "text-amber-400 border-amber-400"
                              : "text-white/40 border-transparent hover:text-white/60"}`}>
                Rentabilité
              </button>
              <button onClick={() => setTab("objectifs")}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                            ${tab === "objectifs"
                              ? "text-blue-400 border-blue-400"
                              : "text-white/40 border-transparent hover:text-white/60"}`}>
                Objectifs
              </button>



            <button onClick={() => setTab("alimentation")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                          ${tab === "alimentation"
                            ? "text-orange-400 border-orange-400"
                            : "text-white/40 border-transparent hover:text-white/60"}`}>
              Alimentation
            </button>

          {estPondeuse && (
            <button
              onClick={() => setTab("ponte")}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
                ${
                  tab === "ponte"
                    ? "text-orange-400 border-orange-400"
                    : "text-white/40 border-transparent hover:text-white/60"
                }`}
            >
              Ponte
            </button>
          )}
          </div>

          {tab === "mortalite" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MortaliteForm
                bandeId={bandeId}
                effectifActuel={bande.effectifActuel}
                onSuccess={invalidateAll}
              />
              <MortaliteHistory mortalites={mortalites} bandeId={bandeId} 
                   effectifInitial={bande.effectifInitial} />
            </div>
          )}

          {tab === "prophylaxie" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProphylaxieForm
                bandeId={bandeId}
                onSuccess={invalidateAll}
              />
              <ProphylaxieHistory entries={prophylaxies} />
            </div>
          )}
          {tab === "finances" && (
            <FinancesDashboard
              bandeId={bandeId}
              effectifInitial={bande.effectifInitial}
            />
          )}
          {tab === "alimentation" && (
              <AlimentationBandePanel
                bandeId={bandeId}
                effectifInitial={bande.effectifInitial}
              />
            )}

     
       
          {tab === "ponte" && estPondeuse && (
            <PontePanel bandeId={bandeId} />
          )}
         
          {tab === "pesee" && (
            <div className="flex flex-col gap-4">
              <CourbeCroissanceChart
                data={courbe}
                especeNom={bande.especeNom}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PeseeForm
                  bandeId={bandeId}
                  onSuccess={invalidateAll}
                />
                <PeseeHistory pesees={pesees} />
              </div>
            </div>
          )}
          {tab === "ventes" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <VenteForm
                bandeId={bandeId}
                effectifActuel={bande.effectifActuel}
                onSuccess={invalidateAll}
              />
              {/* Historique des ventes depuis RentabilitePanel */}
              <RentabilitePanel bandeId={bandeId} />
            </div>
          )}

          {tab === "rentabilite" && (
            <RentabilitePanel bandeId={bandeId} />
          )}

          {tab === "objectifs" && (
            <ObjectifPanel bandeId={bandeId} />
          )}

         
          {showCloture && (
            <ClotureBandeModal
              bandeId={bandeId}
              effectifActuel={bande.effectifActuel}
              onClose={() => setShowCloture(false)}
            />
          )}

        </main>
      </div>
    </div>
  )
}