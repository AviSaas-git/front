"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormField }   from "@/components/ui/FormField"
import { ProgressBar } from "./ProgressBar"
import type { BatimentFormData } from "@/lib/types/forms"
import { creerBatiment } from "@/lib/api/batiments"
type Props = {
  fermeId:   string
  fermeName: string
  onBack:    () => void
}

const INITIAL: BatimentFormData = {
  nom:           "",
  capacite:      0,
  surfaceM2:     undefined,
  typeChauffage: "aucun",
  type:          "poulailler",
}

const TYPE_OPTIONS = [
  { value: "poulailler", label: "Poulailler" },
  { value: "porcherie",  label: "Porcherie" },
  { value: "clapier",    label: "Clapier (lapins)" },
  { value: "polyvalent", label: "Polyvalent" },
]

const CHAUFFAGE_OPTIONS = [
  { value: "aucun",     label: "Aucun" },
  { value: "gaz",       label: "Gaz propane" },
  { value: "electrique",label: "Électrique" },
  { value: "bois",      label: "Bois" },
]

type BatimentErrors = Partial<Record<keyof BatimentFormData, string>>

export function StepBatiment({ fermeId, fermeName, onBack }: Props) {
  const router = useRouter()
  const [form, setForm]       = useState<BatimentFormData>(INITIAL)
  const [errors, setErrors]   = useState<BatimentErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof BatimentFormData, value: string) {
    const parsed =
      field === "capacite" || field === "surfaceM2"
        ? value === "" ? undefined : Number(value)
        : value

    setForm((prev) => ({ ...prev, [field]: parsed }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: BatimentErrors = {}

    if (!form.nom.trim())
      next.nom = "Le nom est obligatoire"

    if (!form.capacite || form.capacite <= 0)
      next.capacite = "Capacité invalide — minimum 1"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // ← ICI : POST /api/v1/batiments { fermeId, ...form }
    await creerBatiment(fermeId, form)
    router.push("/dashboard")
    } catch {
      setErrors({ nom: "Erreur serveur. Réessayez." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7">
      <ProgressBar currentStep={2} totalSteps={2} />

      {/* Confirmation ferme créée */}
      <div className="flex items-center gap-2.5 bg-green-400/8
                      border border-green-400/15 rounded-xl
                      px-3.5 py-2.5 mb-6">
        <span className="text-green-400 text-sm">✓</span>
        <p className="text-xs text-green-300/80">
          Ferme <span className="font-medium text-green-300">{fermeName}</span> créée avec succès
        </p>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-medium text-white mb-1.5">
          Votre premier bâtiment
        </h1>
        <p className="text-sm text-white/40 leading-relaxed">
          Un bâtiment = un poulailler ou une porcherie. Vous pourrez
          en ajouter d&apos;autres depuis les paramètres.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <FormField
          label="Nom du bâtiment"
          placeholder="Ex : Bâtiment A"
          value={form.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          error={errors.nom}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Capacité (places)"
            type="number"
            placeholder="Ex : 5 000"
            value={form.capacite || ""}
            onChange={(e) => handleChange("capacite", e.target.value)}
            error={errors.capacite}
          />
          <FormField
            label="Surface (m²)"
            type="number"
            placeholder="Ex : 200"
            hint="optionnel"
            value={form.surfaceM2 ?? ""}
            onChange={(e) => handleChange("surfaceM2", e.target.value)}
          />
        </div>

        <FormField
          as="select"
          label="Type de bâtiment"
          options={TYPE_OPTIONS}
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
        />

        <FormField
          as="select"
          label="Type de chauffage"
          hint="optionnel"
          options={CHAUFFAGE_OPTIONS}
          value={form.typeChauffage ?? "aucun"}
          onChange={(e) => handleChange("typeChauffage", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-green-950 font-medium rounded-xl text-sm
                     transition-colors mt-1"
        >
          {loading ? "Finalisation…" : "Terminer la configuration →"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 bg-transparent border border-white/10
                     text-white/50 hover:text-white/70 hover:border-white/20
                     rounded-xl text-sm transition-colors"
        >
          ← Retour
        </button>

      </form>
    </div>
  )
}