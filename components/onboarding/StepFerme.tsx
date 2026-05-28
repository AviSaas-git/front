"use client"

import { useState } from "react"
import { FormField }   from "@/components/ui/FormField"
import { ProgressBar } from "./ProgressBar"
import type { FermeFormData } from "@/lib/types/forms"
import { creerFerme } from "@/lib/api/fermes"

type Props = {
  onDone: (fermeId: string, nom: string) => void
}

const INITIAL: FermeFormData = {
  nom:          "",
  localisation: "",
  surfaceM2:    undefined,
  capaciteMax:  0,
}

type FermeErrors = Partial<Record<keyof FermeFormData, string>>

export function StepFerme({ onDone }: Props) {
  const [form, setForm]     = useState<FermeFormData>(INITIAL)
  const [errors, setErrors] = useState<FermeErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof FermeFormData, value: string) {
    const parsed =
      field === "capaciteMax" || field === "surfaceM2"
        ? value === "" ? undefined : Number(value)
        : value

    setForm((prev) => ({ ...prev, [field]: parsed }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: FermeErrors = {}

    if (!form.nom.trim())
      next.nom = "Le nom est obligatoire"

    if (!form.localisation.trim())
      next.localisation = "La localisation est obligatoire"

    if (!form.capaciteMax || form.capaciteMax <= 0)
      next.capaciteMax = "Capacité invalide — minimum 1"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const ferme = await creerFerme(form)
      onDone(ferme.id, ferme.nom)
    } catch {
      setErrors({ nom: "Erreur serveur. Réessayez." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7">
      <ProgressBar currentStep={1} totalSteps={2} />

      <div className="mb-6">
        <h1 className="text-xl font-medium text-white mb-1.5">
          Votre ferme
        </h1>
        <p className="text-sm text-white/40 leading-relaxed">
          Ces informations permettent à AviSaaS de personnaliser
          votre expérience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <FormField
          label="Nom de la ferme"
          placeholder="Ex : Ferme Mbanga"
          value={form.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          error={errors.nom}
        />

        <FormField
          label="Localisation"
          placeholder="Ville, Région"
          value={form.localisation}
          onChange={(e) => handleChange("localisation", e.target.value)}
          error={errors.localisation}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Surface (m²)"
            type="number"
            placeholder="Ex : 600"
            hint="optionnel"
            value={form.surfaceM2 ?? ""}
            onChange={(e) => handleChange("surfaceM2", e.target.value)}
          />
          <FormField
            label="Capacité max (animaux)"
            type="number"
            placeholder="Ex : 10 000"
            value={form.capaciteMax || ""}
            onChange={(e) => handleChange("capaciteMax", e.target.value)}
            error={errors.capaciteMax}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-green-950 font-medium rounded-xl text-sm
                     transition-colors mt-1"
        >
          {loading ? "Enregistrement…" : "Continuer →"}
        </button>
      </form>
    </div>
  )
}