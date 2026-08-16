"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"

type Props = {
  onSubmit: (data: {
    date: string; typeAliment: string; quantiteKg: number
    prixParKgFcfa: number; observations?: string
  }) => Promise<void>
  context?: string
}

const today = new Date().toISOString().split("T")[0]

const TYPES_ALIMENT = [
  { value: "Démarrage",   label: "Démarrage (J0–J21)" },
  { value: "Croissance",  label: "Croissance (J21–J35)" },
  { value: "Finition",    label: "Finition (J35–abattage)" },
  { value: "Ponte",       label: "Ponte" },
  { value: "Gestation",   label: "Gestation / allaitante" },
  { value: "Maintenance", label: "Maintenance" },
]

export function ConsommationForm({ onSubmit, context = "bande" }: Props) {
  const [form, setForm] = useState({
    date: today, typeAliment: "", quantiteKg: "", prixParKgFcfa: "", observations: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function h(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const kg   = Number(form.quantiteKg)
    const prix = Number(form.prixParKgFcfa)
    if (!form.typeAliment) { setError("Sélectionnez le type d'aliment"); return }
    if (!kg || kg <= 0)    { setError("Quantité invalide"); return }
    if (!prix || prix <= 0) { setError("Prix invalide"); return }

    setLoading(true)
    try {
      await onSubmit({
        date: form.date, typeAliment: form.typeAliment,
        quantiteKg: kg, prixParKgFcfa: prix,
        observations: form.observations || undefined,
      })
      setForm({ date: today, typeAliment: "", quantiteKg: "", prixParKgFcfa: "", observations: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  const montantPreview =
    Number(form.quantiteKg) && Number(form.prixParKgFcfa)
      ? Math.round(Number(form.quantiteKg) * Number(form.prixParKgFcfa))
      : null

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">
        Consommation aliment
      </h2>
      <p className="text-xs text-white/40 mb-4">
        Saisie journalière par {context === "bande" ? "bande" : "animal"}
      </p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">
          ✓ Consommation enregistrée
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date" type="date" value={form.date}
          onChange={(e) => h("date", e.target.value)} />

        <FormField as="select" label="Type d'aliment"
          options={[
            { value: "", label: "Sélectionner…" },
            ...TYPES_ALIMENT,
          ]}
          value={form.typeAliment}
          onChange={(e) => h("typeAliment", e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Quantité (kg)" type="number" placeholder="Ex : 25"
            value={form.quantiteKg}
            onChange={(e) => h("quantiteKg", e.target.value)} />
          <FormField label="Prix / kg (FCFA)" type="number" placeholder="Ex : 450"
            value={form.prixParKgFcfa}
            onChange={(e) => h("prixParKgFcfa", e.target.value)} />
        </div>

        {montantPreview && (
          <p className="text-[11px] text-white/30">
            Montant : <span className="text-white/60">
              {montantPreview.toLocaleString("fr-FR")} FCFA
            </span>
          </p>
        )}

        <FormField label="Observations" placeholder="Ex : Aliment Distribuvert sac 50kg"
          hint="optionnel" value={form.observations}
          onChange={(e) => h("observations", e.target.value)} />

        {error && <p className="text-xs text-red-400">⚠ {error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-xl text-sm transition-colors mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la consommation"}
        </button>
      </form>
    </div>
  )
}