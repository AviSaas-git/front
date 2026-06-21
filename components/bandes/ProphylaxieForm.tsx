"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { createProphylaxie } from "@/lib/api/bandes"

type Props = { bandeId: string; onSuccess: () => void }
const today = new Date().toISOString().split("T")[0]

const VOIE_OPTIONS = [
  { value: "", label: "Non précisé" },
  { value: "EAU_DE_BOISSON",   label: "Eau de boisson" },
  { value: "INJECTION",        label: "Injection" },
  { value: "SPRAY",            label: "Spray / nébulisation" },
  { value: "ALIMENT",          label: "Incorporé à l'aliment" },
  { value: "OCULAIRE_NASALE",  label: "Oculaire / nasale" },
]

export function ProphylaxieForm({ bandeId, onSuccess }: Props) {
  const [form, setForm] = useState({
    dateApplication: today, traitement: "", laboratoire: "",
    dosage: "", voieAdministration: "", observations: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function h(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.traitement.trim()) { setError("Nom du traitement obligatoire"); return }
    if (!form.dosage.trim())     { setError("Dosage obligatoire"); return }

    setLoading(true)
    try {
      await createProphylaxie(bandeId, {
        dateApplication: form.dateApplication,
        traitement: form.traitement,
        laboratoire: form.laboratoire || undefined,
        dosage: form.dosage,
        voieAdministration: form.voieAdministration || undefined,
        observations: form.observations || undefined,
      })
      setForm({ dateApplication: today, traitement: "", laboratoire: "",
                dosage: "", voieAdministration: "", observations: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Carnet de prophylaxie</h2>
      <p className="text-xs text-white/40 mb-4">
        Le jour (J+x) est calculé automatiquement depuis la date d'arrivée.
      </p>
      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">
          ✓ Traitement enregistré
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date d'application" type="date" value={form.dateApplication}
          onChange={(e) => h("dateApplication", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Traitement / vaccin" placeholder="Ex : Gumboro"
            value={form.traitement} onChange={(e) => h("traitement", e.target.value)} />
          <FormField label="Laboratoire" placeholder="Ex : Ceva" hint="optionnel"
            value={form.laboratoire} onChange={(e) => h("laboratoire", e.target.value)} />
        </div>
        <FormField label="Dosage" placeholder="Ex : 0.5 ml / L eau de boisson"
          value={form.dosage} onChange={(e) => h("dosage", e.target.value)} />
        <FormField as="select" label="Voie d'administration" hint="optionnel"
          options={VOIE_OPTIONS} value={form.voieAdministration}
          onChange={(e) => h("voieAdministration", e.target.value)} />
        <FormField label="Observations" placeholder="Ex : Aucune réaction" hint="optionnel"
          value={form.observations} onChange={(e) => h("observations", e.target.value)} />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-blue-400/90 hover:bg-blue-400 disabled:opacity-40
                     text-blue-950 font-medium rounded-xl text-sm transition-colors mt-1">
          {loading ? "Enregistrement…" : "Ajouter au carnet"}
        </button>
      </form>
    </div>
  )
}