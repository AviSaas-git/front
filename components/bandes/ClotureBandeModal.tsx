"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormField } from "@/components/ui/FormField"
import { cloturerBande } from "@/lib/api/bandes"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

const today = new Date().toISOString().split("T")[0]

const MOTIFS = [
  { value: "VENTE_TOTALE",       label: "Vente totale du lot" },
  { value: "ABATTAGE",           label: "Abattage" },
  { value: "REFORME",            label: "Réforme" },
  { value: "MORTALITE_MASSIVE",  label: "Mortalité massive" },
  { value: "AUTRE",              label: "Autre" },
]

type Props = { bandeId: string; effectifActuel: number; onClose: () => void }

export function ClotureBandeModal({ bandeId, effectifActuel, onClose }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    dateSortie: today, motifCloture: "VENTE_TOTALE",
    effectifVendu: String(effectifActuel),
    poidsMoyenKg: "", prixParKg: "", acheteur: "", observations: "",
  })
  const [loading, setLoading] = useState(false)

  function h(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  const montantTotal =
    form.effectifVendu && form.poidsMoyenKg && form.prixParKg
      ? Number(form.effectifVendu) * Number(form.poidsMoyenKg) * Number(form.prixParKg)
      : null

  function fcfa(n: number) {
    return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
  }

  async function handleCloturer() {
    setLoading(true)
    try {
      await cloturerBande(bandeId, {
        dateSortie: form.dateSortie,
        motifCloture: form.motifCloture,
        effectifVendu: Number(form.effectifVendu) || undefined,
        poidsMoyenKg: Number(form.poidsMoyenKg) || undefined,
        prixParKg: Number(form.prixParKg) || undefined,
        acheteur: form.acheteur || undefined,
        observations: form.observations || undefined,
      })
      toastSuccess("Bande clôturée — le bâtiment est passé en mode nettoyage.")
      onClose()
      router.push("/bandes")
    } catch (err: any) {
      toastError(traduireErreur(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f0f0f] border border-white/10
                      rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-white">🔒 Clôturer la bande</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 text-lg">×</button>
        </div>

        <div className="bg-amber-400/[0.07] border border-amber-400/15 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-300">
            ⚠ Cette action est irréversible. Le bâtiment sera automatiquement
            passé en mode <strong>Nettoyage</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date de sortie" type="date" value={form.dateSortie}
              onChange={e => h("dateSortie", e.target.value)} />
            <FormField as="select" label="Motif de clôture"
              options={MOTIFS} value={form.motifCloture}
              onChange={e => h("motifCloture", e.target.value)} />
          </div>

          <p className="text-[11px] text-white/40 font-medium tracking-widest mt-1">
            VENTE FINALE (optionnel)
          </p>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Animaux vendus" type="number"
              value={form.effectifVendu} onChange={e => h("effectifVendu", e.target.value)} />
            <FormField label="Poids moy. (kg)" type="number" placeholder="Ex : 2.3"
              value={form.poidsMoyenKg} onChange={e => h("poidsMoyenKg", e.target.value)} />
            <FormField label="Prix / kg (FCFA)" type="number" placeholder="Ex : 1200"
              value={form.prixParKg} onChange={e => h("prixParKg", e.target.value)} />
          </div>

          {montantTotal !== null && (
            <div className="bg-green-400/[0.06] border border-green-400/15 rounded-lg px-3 py-2">
              <p className="text-[10px] text-white/40">Recette finale estimée</p>
              <p className="text-xl font-medium text-green-400">{fcfa(montantTotal)}</p>
            </div>
          )}

          <FormField label="Acheteur" hint="optionnel" value={form.acheteur}
            onChange={e => h("acheteur", e.target.value)} />
          <FormField label="Observations finales" hint="optionnel"
            value={form.observations} onChange={e => h("observations", e.target.value)} />
        </div>

        <div className="flex gap-2 mt-2">
          <button onClick={handleCloturer} disabled={loading}
            className="flex-1 py-2.5 bg-rose-400/90 hover:bg-rose-400
                       disabled:opacity-40 text-rose-950 font-medium
                       rounded-xl text-sm transition-colors">
            {loading ? "Clôture en cours…" : "🔒 Confirmer la clôture"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-white/10 text-white/40
                       hover:text-white/60 rounded-xl text-sm">
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}