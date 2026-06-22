"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { enregistrerPortee } from "@/lib/api/reproduction"
import type { PorteeResult } from "@/lib/api/reproduction"

type Props = {
  reproductionId: string; especeNom: string
  onSuccess: () => void; onCancel: () => void
}

const today = new Date().toISOString().split("T")[0]

export function PorteeForm({ reproductionId, especeNom, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    dateMiseBas: today, nombreNesVivants: "", nombreNesMorts: "0",
    poidsMoyenNaissanceGrammes: "", observations: "",
  })
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [resultat, setResultat] = useState<PorteeResult | null>(null)

  function h(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const vivants = Number(form.nombreNesVivants)
    const morts   = Number(form.nombreNesMorts)
    if (vivants < 0 || (vivants === 0 && morts === 0)) {
      setError("Indiquez au moins un né (vivant ou mort)")
      return
    }

    setLoading(true)
    try {
      const res = await enregistrerPortee(reproductionId, {
        dateMiseBas: form.dateMiseBas,
        nombreNesVivants: vivants,
        nombreNesMorts: morts,
        poidsMoyenNaissanceGrammes: form.poidsMoyenNaissanceGrammes
          ? Number(form.poidsMoyenNaissanceGrammes) : undefined,
        observations: form.observations || undefined,
      })
      setResultat(res)
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  if (resultat) {
    return (
      <div className="mt-3 bg-green-400/[0.06] border border-green-400/15 rounded-xl p-4">
        <p className="text-sm text-green-300 font-medium mb-1">
          ✓ Mise bas enregistrée — {resultat.nombreNesVivants} né{resultat.nombreNesVivants > 1 ? "s" : ""} vivant{resultat.nombreNesVivants > 1 ? "s" : ""}
        </p>
        <p className="text-xs text-white/40 mb-3">
          Fiches animaux générées automatiquement (sexe à déterminer plus tard) :
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resultat.numerosAnimauxGeneres.map((num) => (
            <span key={num} className="text-[11px] font-mono px-2 py-0.5
                                       bg-white/5 text-white/60 rounded-md">
              {num}
            </span>
          ))}
        </div>
        <button onClick={onSuccess}
          className="text-xs text-green-400 hover:text-green-300 underline">
          Fermer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}
      className="mt-3 bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3">
      <p className="text-xs text-white/50">
        Mise bas — {especeNom}. Les nés vivants généreront automatiquement
        une fiche animal (sexe à renseigner plus tard).
      </p>

      <FormField label="Date de mise bas" type="date"
        value={form.dateMiseBas} onChange={(e) => h("dateMiseBas", e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nés vivants" type="number" placeholder="Ex : 9"
          value={form.nombreNesVivants} onChange={(e) => h("nombreNesVivants", e.target.value)} />
        <FormField label="Nés morts" type="number" placeholder="Ex : 1"
          value={form.nombreNesMorts} onChange={(e) => h("nombreNesMorts", e.target.value)} />
      </div>

      <FormField label="Poids moyen naissance (g)" type="number"
        placeholder="Ex : 1400" hint="optionnel"
        value={form.poidsMoyenNaissanceGrammes}
        onChange={(e) => h("poidsMoyenNaissanceGrammes", e.target.value)} />

      <FormField label="Observations" placeholder="Ex : Mise bas sans complication"
        hint="optionnel" value={form.observations}
        onChange={(e) => h("observations", e.target.value)} />

      {error && <p className="text-xs text-red-400">⚠ {error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex-1 py-2 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-lg text-xs transition-colors">
          {loading ? "Enregistrement…" : "Confirmer la mise bas"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 bg-transparent border border-white/10
                     text-white/40 hover:text-white/60 rounded-lg text-xs transition-colors">
          Annuler
        </button>
      </div>
    </form>
  )
}