"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FormField } from "@/components/ui/FormField"
import { createVenteBande } from "@/lib/api/bandes"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

const today = new Date().toISOString().split("T")[0]
function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

type Props = { bandeId: string; effectifActuel: number; onSuccess: () => void }

export function VenteForm({ bandeId, effectifActuel, onSuccess }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    date: today, nombreAnimaux: "", poidsMoyenKg: "",
    prixParKg: "", acheteur: "", observations: "",
  })
  const [loading, setLoading] = useState(false)

  function h(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  const montantPreview =
    form.nombreAnimaux && form.poidsMoyenKg && form.prixParKg
      ? Number(form.nombreAnimaux) * Number(form.poidsMoyenKg) * Number(form.prixParKg)
      : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(form.nombreAnimaux)
    if (!n || n > effectifActuel) {
      toastError(`Nombre invalide — effectif actuel : ${effectifActuel}`)
      return
    }
    if (!form.poidsMoyenKg || !form.prixParKg) {
      toastError("Poids moyen et prix requis")
      return
    }
    setLoading(true)
    try {
      const res = await createVenteBande(bandeId, {
        date: form.date,
        nombreAnimaux: n,
        poidsMoyenKg: Number(form.poidsMoyenKg),
        prixParKg: Number(form.prixParKg),
        acheteur: form.acheteur || undefined,
        observations: form.observations || undefined,
      })
      qc.invalidateQueries({ queryKey: ["ventes-bande", bandeId] })
      qc.invalidateQueries({ queryKey: ["rentabilite", bandeId] })
      qc.invalidateQueries({ queryKey: ["bande", bandeId] })
      toastSuccess(`Vente enregistrée — ${fcfa(res.montantTotal)}`)
      setForm({ date: today, nombreAnimaux: "", poidsMoyenKg: "",
                prixParKg: "", acheteur: "", observations: "" })
      onSuccess()
    } catch (err: any) {
      toastError(traduireErreur(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Enregistrer une vente</h2>
      <p className="text-xs text-white/40 mb-4">
        Effectif disponible : <span className="text-white/70">{effectifActuel} animaux</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date de vente" type="date" value={form.date}
          onChange={e => h("date", e.target.value)} />

        <div className="grid grid-cols-3 gap-3">
          <FormField label="Nb animaux vendus" type="number" placeholder="Ex : 100"
            value={form.nombreAnimaux} onChange={e => h("nombreAnimaux", e.target.value)} />
          <FormField label="Poids moyen (kg)" type="number" placeholder="Ex : 2.3"
            value={form.poidsMoyenKg} onChange={e => h("poidsMoyenKg", e.target.value)} />
          <FormField label="Prix / kg (FCFA)" type="number" placeholder="Ex : 1200"
            value={form.prixParKg} onChange={e => h("prixParKg", e.target.value)} />
        </div>

        {montantPreview !== null && (
          <div className="bg-green-400/[0.06] border border-green-400/15 rounded-lg px-3 py-2">
            <p className="text-[11px] text-white/40">Montant estimé</p>
            <p className="text-lg font-medium text-green-400">{fcfa(montantPreview)}</p>
            <p className="text-[10px] text-white/30">
              {form.nombreAnimaux} animaux × {form.poidsMoyenKg} kg × {form.prixParKg} F/kg
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Acheteur" hint="optionnel" value={form.acheteur}
            onChange={e => h("acheteur", e.target.value)} />
          <FormField label="Observations" hint="optionnel" value={form.observations}
            onChange={e => h("observations", e.target.value)} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-xl text-sm mt-1">
          {loading ? "Enregistrement…" : "Confirmer la vente →"}
        </button>
      </form>
    </div>
  )
}