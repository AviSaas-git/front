"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { createEvenementAnimal } from "@/lib/api/animaux"

type Props = { animalId: string; onSuccess: () => void }
const today = new Date().toISOString().split("T")[0]

const TYPES = [
  { value: "PESEE",       label: "⚖ Pesée" },
  { value: "PROPHYLAXIE", label: "💉 Prophylaxie / vaccin" },
  { value: "MALADIE",     label: "🤒 Maladie" },
  { value: "MORT",        label: "💀 Décès" },
  { value: "VENTE",       label: "🏷 Vente" },
  { value: "AUTRE",       label: "📝 Autre" },
]

const VOIES = [
  { value: "",                label: "Non précisé" },
  { value: "EAU_DE_BOISSON",  label: "Eau de boisson" },
  { value: "INJECTION",       label: "Injection" },
  { value: "SPRAY",           label: "Spray" },
  { value: "ALIMENT",         label: "Aliment" },
  { value: "OCULAIRE_NASALE", label: "Oculaire / nasale" },
]

export function EvenementAnimalForm({ animalId, onSuccess }: Props) {
  const [type, setType]       = useState("PESEE")
  const [form, setForm]       = useState({
    date: today, poidsKg: "", traitement: "", laboratoire: "",
    dosage: "", voieAdministration: "", cause: "", observations: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function h(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (type === "PESEE" && !form.poidsKg) {
      setError("Le poids est obligatoire pour une pesée"); return
    }
    if (type === "PROPHYLAXIE" && !form.traitement) {
      setError("Le traitement est obligatoire"); return
    }

    setLoading(true)
    try {
      await createEvenementAnimal(animalId, {
        date: form.date,
        type,
        poidsKg:           form.poidsKg ? Number(form.poidsKg) : undefined,
        traitement:        form.traitement || undefined,
        laboratoire:       form.laboratoire || undefined,
        dosage:            form.dosage || undefined,
        voieAdministration: form.voieAdministration || undefined,
        cause:             form.cause || undefined,
        observations:      form.observations || undefined,
      })
      setForm({ date: today, poidsKg: "", traitement: "", laboratoire: "",
                dosage: "", voieAdministration: "", cause: "", observations: "" })
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
      <h2 className="text-sm font-medium text-white mb-1">Enregistrer un événement</h2>
      <p className="text-xs text-white/40 mb-4">Pesée, traitement, mort, vente…</p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">✓ Événement enregistré</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date" type="date" value={form.date}
          onChange={(e) => h("date", e.target.value)} />

        <FormField as="select" label="Type d'événement"
          options={TYPES} value={type}
          onChange={(e) => setType(e.target.value)} />

        {/* Pesée */}
        {type === "PESEE" && (
          <FormField label="Poids (kg)" type="number" placeholder="Ex : 85.5"
            value={form.poidsKg} onChange={(e) => h("poidsKg", e.target.value)} />
        )}

        {/* Prophylaxie */}
        {type === "PROPHYLAXIE" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Traitement" placeholder="Ex : Newcastle"
                value={form.traitement} onChange={(e) => h("traitement", e.target.value)} />
              <FormField label="Laboratoire" placeholder="Ex : Ceva" hint="optionnel"
                value={form.laboratoire} onChange={(e) => h("laboratoire", e.target.value)} />
            </div>
            <FormField label="Dosage" placeholder="Ex : 2 ml IM"
              value={form.dosage} onChange={(e) => h("dosage", e.target.value)} />
            <FormField as="select" label="Voie d'administration" options={VOIES}
              value={form.voieAdministration}
              onChange={(e) => h("voieAdministration", e.target.value)} />
          </>
        )}

        {/* Maladie, Mort, Vente — cause */}
        {(type === "MALADIE" || type === "MORT" || type === "VENTE") && (
          <FormField label={type === "VENTE" ? "Acheteur / destination" : "Cause"}
            placeholder={type === "MORT" ? "Ex : Entérite" : ""}
            value={form.cause} onChange={(e) => h("cause", e.target.value)} />
        )}

        <FormField label="Observations" placeholder="Remarques libres" hint="optionnel"
          value={form.observations} onChange={(e) => h("observations", e.target.value)} />

        {error && <p className="text-xs text-red-400">⚠ {error}</p>}

        <button type="submit" disabled={loading}
          className={`w-full py-2.5 disabled:opacity-40 font-medium rounded-xl
                      text-sm transition-colors mt-1
                      ${type === "MORT"
                        ? "bg-rose-400 hover:bg-rose-300 text-rose-950"
                        : "bg-green-400 hover:bg-green-300 text-green-950"}`}>
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}