"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormField } from "@/components/ui/FormField"
import { fetchObjectif, saveObjectif } from "@/lib/api/bandes"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

type Props = { bandeId: string }

export function ObjectifPanel({ bandeId }: Props) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    objectifPoidsFinKg: "", objectifDureeCycle: "",
    objectifTauxMortaliteMax: "", objectifICMax: "",
    objectifGainMoyenJour: "", objectifPrixVenteKg: "",
    objectifMargeNetteMin: "", notes: "",
  })

  const { data: objectif } = useQuery({
    queryKey: ["objectif", bandeId],
    queryFn:  () => fetchObjectif(bandeId),
    onSuccess: (d) => {
      if (d) setForm({
        objectifPoidsFinKg:      String(d.objectifPoidsFinKg ?? ""),
        objectifDureeCycle:      String(d.objectifDureeCycle ?? ""),
        objectifTauxMortaliteMax:String(d.objectifTauxMortaliteMax ?? ""),
        objectifICMax:           String(d.objectifICMax ?? ""),
        objectifGainMoyenJour:   String(d.objectifGainMoyenJour ?? ""),
        objectifPrixVenteKg:     String(d.objectifPrixVenteKg ?? ""),
        objectifMargeNetteMin:   String(d.objectifMargeNetteMin ?? ""),
        notes:                   d.notes ?? "",
      })
    },
  } as any)

  function h(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  async function handleSave() {
    setLoading(true)
    try {
      await saveObjectif(bandeId, {
        objectifPoidsFinKg:       form.objectifPoidsFinKg ? Number(form.objectifPoidsFinKg) : undefined,
        objectifDureeCycle:       form.objectifDureeCycle ? Number(form.objectifDureeCycle) : undefined,
        objectifTauxMortaliteMax: form.objectifTauxMortaliteMax ? Number(form.objectifTauxMortaliteMax) : undefined,
        objectifICMax:            form.objectifICMax ? Number(form.objectifICMax) : undefined,
        objectifGainMoyenJour:    form.objectifGainMoyenJour ? Number(form.objectifGainMoyenJour) : undefined,
        objectifPrixVenteKg:      form.objectifPrixVenteKg ? Number(form.objectifPrixVenteKg) : undefined,
        objectifMargeNetteMin:    form.objectifMargeNetteMin ? Number(form.objectifMargeNetteMin) : undefined,
        notes:                    form.notes || undefined,
      })
      qc.invalidateQueries({ queryKey: ["objectif", bandeId] })
      toastSuccess("Objectifs enregistrés.")
      setEditing(false)
    } catch (err: any) {
      toastError(traduireErreur(err))
    } finally {
      setLoading(false)
    }
  }

  const CARD_COLOR = (appreciation?: string) =>
    appreciation?.startsWith("✅") ? "text-green-400"
    : appreciation?.startsWith("⚠") ? "text-amber-400"
    : appreciation?.startsWith("❌") ? "text-rose-400"
    : "text-white/60"

  return (
    <div className="flex flex-col gap-4">

      {/* Résumé actuel */}
      {objectif && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {objectif.objectifPoidsFinKg && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1">Poids cible</p>
              <p className="text-xl font-medium text-white">
                {objectif.objectifPoidsFinKg} kg
              </p>
              <p className="text-[10px] text-white/40 mt-1">
                Actuel : {objectif.poidsActuelKg?.toFixed(2) ?? "—"} kg
              </p>
              <p className={`text-[11px] mt-1 ${CARD_COLOR(objectif.appreciationPoids)}`}>
                {objectif.appreciationPoids}
              </p>
            </div>
          )}
          {objectif.objectifTauxMortaliteMax && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1">Taux mort. max</p>
              <p className="text-xl font-medium text-white">
                {objectif.objectifTauxMortaliteMax}%
              </p>
              <p className="text-[10px] text-white/40 mt-1">
                Actuel : {objectif.tauxMortaliteActuel?.toFixed(1) ?? "—"}%
              </p>
              <p className={`text-[11px] mt-1 ${CARD_COLOR(objectif.appreciationMortalite)}`}>
                {objectif.appreciationMortalite}
              </p>
            </div>
          )}
          {objectif.progressionPct !== undefined && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1">Progression cycle</p>
              <p className="text-xl font-medium text-white">
                {objectif.progressionPct?.toFixed(0)}%
              </p>
              <div className="mt-2 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all"
                  style={{ width: `${objectif.progressionPct}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulaire ou affichage */}
      {editing ? (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">Définir les objectifs</h2>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Poids cible fin de cycle (kg)" type="number" placeholder="Ex : 2.5"
              value={form.objectifPoidsFinKg} onChange={e => h("objectifPoidsFinKg", e.target.value)} />
            <FormField label="Durée cycle cible (jours)" type="number" placeholder="Ex : 42"
              value={form.objectifDureeCycle} onChange={e => h("objectifDureeCycle", e.target.value)} />
            <FormField label="Taux mortalité max (%)" type="number" placeholder="Ex : 2.5"
              value={form.objectifTauxMortaliteMax} onChange={e => h("objectifTauxMortaliteMax", e.target.value)} />
            <FormField label="GMQ cible (g/jour)" type="number" placeholder="Ex : 58"
              value={form.objectifGainMoyenJour} onChange={e => h("objectifGainMoyenJour", e.target.value)} />
            <FormField label="IC max (kg aliment/kg vif)" type="number" placeholder="Ex : 1.8"
              value={form.objectifICMax} onChange={e => h("objectifICMax", e.target.value)} />
            <FormField label="Prix vente cible (FCFA/kg)" type="number" placeholder="Ex : 1200"
              value={form.objectifPrixVenteKg} onChange={e => h("objectifPrixVenteKg", e.target.value)} />
          </div>
          <FormField label="Marge nette minimum (FCFA)" type="number" placeholder="Ex : 500000"
            value={form.objectifMargeNetteMin} onChange={e => h("objectifMargeNetteMin", e.target.value)} />
          <FormField label="Notes" hint="optionnel" value={form.notes}
            onChange={e => h("notes", e.target.value)} />

          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={loading}
              className="flex-1 py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                         text-green-950 font-medium rounded-xl text-sm">
              {loading ? "Enregistrement…" : "Enregistrer les objectifs"}
            </button>
            <button onClick={() => setEditing(false)}
              className="px-5 border border-white/10 text-white/40
                         hover:text-white/60 rounded-xl text-sm">
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button onClick={() => setEditing(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60
                       hover:text-white/80 rounded-xl text-xs transition-colors">
            ✏ {objectif?.objectifPoidsFinKg ? "Modifier les objectifs" : "Définir les objectifs"}
          </button>
        </div>
      )}
    </div>
  )  
}