"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { createDepense } from "@/lib/api/finances"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"


type Props = { bandeId: string; onSuccess: () => void }
const today = new Date().toISOString().split("T")[0]

const SOUS_CATEGORIES: Record<string, string[]> = {
  PRODUCTION: [
    "Alimentation", "Prophylaxie / vaccins", "Chauffage",
    "Transport poussins", "Analyses vétérinaires", "Produits divers",
  ],
  CHARGE_FIXE: [
    "Amortissement bâtiment", "Électricité", "Eau",
    "Salaires", "Maintenance", "Frais administratifs", "Autre",
  ],
}

export function DepenseForm({ bandeId, onSuccess }: Props) {
  const [form, setForm] = useState({
    date: today, categorie: "PRODUCTION", sousCategorie: "",
    montant: "", fournisseur: "", description: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function h(field: string, value: string) {
    setForm((p) => {
      const next = { ...p, [field]: value }
      if (field === "categorie") next.sousCategorie = ""
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const montant = Number(form.montant)
    if (!montant || montant <= 0) { setError("Montant invalide"); return }
    if (!form.sousCategorie)      { setError("Sélectionnez une sous-catégorie"); return }

    setLoading(true)
    try {
      await createDepense(bandeId, {
        date:          form.date,
        categorie:     form.categorie,
        sousCategorie: form.sousCategorie,
        montant,
        fournisseur:   form.fournisseur || undefined,
        description:   form.description || undefined,
      })

      toastSuccess(`Dépense de ${(montant)} enregistrée.`)
      setForm({ date: today, categorie: "PRODUCTION", sousCategorie: "",
                montant: "", fournisseur: "", description: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSuccess()
    } catch (err: any) {
        toastError(traduireErreur(err))
    } finally {
      setLoading(false)
    }
  }

  const sousCats = SOUS_CATEGORIES[form.categorie] ?? []

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Ajouter une dépense</h2>
      <p className="text-xs text-white/40 mb-4">En FCFA</p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">
          ✓ Dépense enregistrée
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date" type="date" value={form.date}
          onChange={(e) => h("date", e.target.value)} />

        <FormField as="select" label="Catégorie"
          options={[
            { value: "PRODUCTION",  label: "🌾 Production (liée à la bande)" },
            { value: "CHARGE_FIXE", label: "🏗 Charge fixe (partagée)" },
          ]}
          value={form.categorie}
          onChange={(e) => h("categorie", e.target.value)} />

        <FormField as="select" label="Sous-catégorie"
          options={[
            { value: "", label: "Sélectionner…" },
            ...sousCats.map((s) => ({ value: s, label: s })),
            { value: "__autre", label: "Autre (saisie libre)" },
          ]}
          value={form.sousCategorie}
          onChange={(e) => h("sousCategorie", e.target.value)} />

        {form.sousCategorie === "__autre" && (
          <input placeholder="Libellé de la dépense"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10
                       rounded-lg text-sm text-white outline-none
                       focus:border-green-400/40"
            onChange={(e) => h("sousCategorie", e.target.value)} />
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Montant (FCFA)" type="number" placeholder="Ex : 45000"
            value={form.montant}
            onChange={(e) => h("montant", e.target.value)} />
          <FormField label="Fournisseur" placeholder="Ex : Distribuvert" hint="optionnel"
            value={form.fournisseur}
            onChange={(e) => h("fournisseur", e.target.value)} />
        </div>

        <FormField label="Description" placeholder="Ex : 3 sacs aliment démarrage" hint="optionnel"
          value={form.description}
          onChange={(e) => h("description", e.target.value)} />

        {error && <p className="text-xs text-red-400">⚠ {error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-xl text-sm transition-colors mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la dépense"}
        </button>
      </form>
    </div>
  )
}
