"use client"

import { useState } from "react"
import { confirmerGestation, declarerEchec } from "@/lib/api/reproduction"
import type { ReproductionEntry } from "@/lib/api/reproduction"
import { PorteeForm } from "./PorteeForm"

type Props = { repro: ReproductionEntry; onUpdated: () => void }

const STATUT_STYLES: Record<string, { label: string; className: string }> = {
  SAILLIE:  { label: "Saillie enregistrée", className: "bg-blue-400/10 text-blue-300" },
  GESTANTE: { label: "Gestante",            className: "bg-amber-400/10 text-amber-300" },
  MISE_BAS: { label: "Mise bas",            className: "bg-green-400/10 text-green-300" },
  ECHEC:    { label: "Échec",               className: "bg-rose-400/10 text-rose-300" },
}

export function SaillieCard({ repro, onUpdated }: Props) {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState("")
  const [showPortee, setShowPortee] = useState(false)

  const statut = STATUT_STYLES[repro.statut]
  const enRetard = repro.joursRestants < 0 &&
    (repro.statut === "GESTANTE" || repro.statut === "SAILLIE")

  async function handleConfirmer() {
    setLoading(true); setError("")
    try { await confirmerGestation(repro.id); onUpdated() }
    catch (err: any) { setError(err.response?.data?.message ?? "Erreur serveur.") }
    finally { setLoading(false) }
  }

  async function handleEchec() {
    setLoading(true); setError("")
    try { await declarerEchec(repro.id); onUpdated() }
    catch (err: any) { setError(err.response?.data?.message ?? "Erreur serveur.") }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{repro.especeIcon}</span>
          <div>
            <p className="text-sm text-white/85 font-medium">
              {repro.femelleNumero}{repro.femelleNom ? ` (${repro.femelleNom})` : ""}
              {repro.maleNumero && <span className="text-white/40"> × {repro.maleNumero}</span>}
            </p>
            <p className="text-[11px] text-white/35">
              Saillie le {new Date(repro.dateSaillie).toLocaleDateString("fr-FR")}
              {" · "}{repro.especeNom}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statut.className}`}>
          {statut.label}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className={`text-xs ${enRetard ? "text-rose-400" : "text-white/50"}`}>
          {repro.statut === "MISE_BAS" || repro.statut === "ECHEC"
            ? `Mise bas prévue : ${new Date(repro.dateMiseBasPrevue).toLocaleDateString("fr-FR")}`
            : enRetard
              ? `⚠ En retard de ${Math.abs(repro.joursRestants)} jour${Math.abs(repro.joursRestants) > 1 ? "s" : ""}`
              : `Mise bas prévue dans ${repro.joursRestants} jour${repro.joursRestants > 1 ? "s" : ""}`}
        </p>

        {(repro.statut === "SAILLIE" || repro.statut === "GESTANTE") && (
          <div className="flex gap-1.5">
            {repro.statut === "SAILLIE" && (
              <button onClick={handleConfirmer} disabled={loading}
                className="text-[11px] px-2.5 py-1 bg-amber-400/10 hover:bg-amber-400/20
                           text-amber-300 rounded-lg transition-colors disabled:opacity-40">
                Confirmer gestante
              </button>
            )}
            <button onClick={() => setShowPortee((v) => !v)} disabled={loading}
              className="text-[11px] px-2.5 py-1 bg-green-400/10 hover:bg-green-400/20
                         text-green-300 rounded-lg transition-colors disabled:opacity-40">
              Enregistrer mise bas
            </button>
            <button onClick={handleEchec} disabled={loading}
              className="text-[11px] px-2.5 py-1 bg-rose-400/10 hover:bg-rose-400/20
                         text-rose-300 rounded-lg transition-colors disabled:opacity-40">
              Échec
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-2">⚠ {error}</p>}

      {showPortee && (
        <PorteeForm
          reproductionId={repro.id}
          especeNom={repro.especeNom}
          onSuccess={() => { setShowPortee(false); onUpdated() }}
          onCancel={() => setShowPortee(false)}
        />
      )}
    </div>
  )
}