"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchReproductions } from "@/lib/api/reproduction"
import { SaillieCard } from "./SaillieCard"

export function ReproductionShell() {
  const router = useRouter()
  const qc = useQueryClient()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(!!localStorage.getItem("avisaas_token"))
  }, [])

  const { data: reproductions = [], isLoading } = useQuery({
    queryKey: ["reproductions"],
    queryFn:  fetchReproductions,
    enabled:  ready,
  })

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["reproductions"] })
    qc.invalidateQueries({ queryKey: ["dashboard"] })
    qc.invalidateQueries({ queryKey: ["animaux"] })
  }

  const enCours   = reproductions.filter((r) => r.statut === "SAILLIE" || r.statut === "GESTANTE")
  const terminees = reproductions.filter((r) => r.statut === "MISE_BAS" || r.statut === "ECHEC")

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Reproduction" subtitle="Saillies, gestations et mises bas" />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">
              {enCours.length} gestation{enCours.length > 1 ? "s" : ""} en cours
            </p>
            <button onClick={() => router.push("/reproduction/nouvelle")}
              className="px-3 py-1.5 bg-green-400 hover:bg-green-300
                         text-green-950 font-medium rounded-lg text-xs transition-colors">
              + Nouvelle saillie
            </button>
          </div>

          {!ready || isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <section>
                <p className="text-xs font-medium text-white/50 mb-2">En cours</p>
                {enCours.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl
                                  p-6 text-center text-white/30 text-sm">
                    Aucune gestation en cours
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {enCours.map((r) => (
                      <SaillieCard key={r.id} repro={r} onUpdated={invalidate} />
                    ))}
                  </div>
                )}
              </section>

              {terminees.length > 0 && (
                <section>
                  <p className="text-xs font-medium text-white/50 mb-2">Historique</p>
                  <div className="flex flex-col gap-2.5">
                    {terminees.map((r) => (
                      <SaillieCard key={r.id} repro={r} onUpdated={invalidate} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  )
}