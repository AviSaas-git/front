"use client"

import { useState }   from "react"
import { useRouter }  from "next/navigation"
import { FormField }  from "@/components/ui/FormField"
import {
  BATIMENTS_MOCK,
  ANIMAUX_REPRODUCTEURS_MOCK,
} from "@/lib/constants/especes"
import type { EspeceConfig, AnimalFormData } from "@/lib/types/elevage"
import { demarrerElevage } from "@/lib/api/elevages"
type Props = {
  espece: EspeceConfig
  onBack: () => void
}

type AnimalErrors = Partial<Record<keyof AnimalFormData, string>>

export function StepFormAnimal({ espece, onBack }: Props) {
  const router = useRouter()

  const [form, setForm] = useState<AnimalFormData>({
    especeId:      espece.id,
    batimentId:    "",
    numero:        "",
    nom:           "",
    sexe:          "FEMELLE",
    dateNaissance: "",
    origine:       "ACHAT",
    pereId:        "",
    mereId:        "",
  })

  const [errors, setErrors]   = useState<AnimalErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof AnimalFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: AnimalErrors = {}

    if (!form.numero.trim())
      next.numero = "Le numéro est obligatoire"

    if (!form.batimentId)
      next.batimentId = "Sélectionnez un bâtiment"

    if (!form.dateNaissance)
      next.dateNaissance = "Date de naissance obligatoire"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // ← ICI : POST /api/v1/elevages/demarrer { ...form }
     
      await demarrerElevage(form)
      router.push("/dashboard")

    } catch {
      setErrors({ numero: "Erreur serveur. Réessayez." })
    } finally {
      setLoading(false)
    }
  }

  const batOptions = BATIMENTS_MOCK.map((b) => ({
    value: b.id,
    label: `${b.nom} — ${b.capacite} places`,
  }))

  const maleOptions = [
    { value: "", label: "— Inconnu (achat)" },
    ...ANIMAUX_REPRODUCTEURS_MOCK
      .filter((a) => a.sexe === "MALE")
      .map((a) => ({ value: a.id, label: a.numero })),
  ]

  const femelleOptions = [
    { value: "", label: "— Inconnue (achat)" },
    ...ANIMAUX_REPRODUCTEURS_MOCK
      .filter((a) => a.sexe === "FEMELLE")
      .map((a) => ({ value: a.id, label: a.numero })),
  ]

  return (
    <div className="bg-white/[0.03] border border-white/8
                    rounded-2xl p-6">

      {/* Barre de progression */}
      <div className="flex gap-1.5 mb-4">
        <div className="flex-1 h-px bg-green-400 rounded-full" />
        <div className="flex-1 h-px bg-green-400 rounded-full" />
      </div>
      <p className="text-[11px] text-white/30 mb-4">
        Étape <span className="text-white/60 font-medium">2</span> sur{" "}
        <span className="text-white/60 font-medium">2</span>
      </p>

      {/* Badge espèce */}
      <div className="inline-flex items-center gap-2
                      bg-violet-400/8 border border-violet-400/15
                      text-violet-300 px-3 py-1 rounded-full
                      text-xs font-medium mb-4">
        <span>{espece.icon}</span>
        <span>{espece.nom} · Mode INDIVIDUEL</span>
      </div>

      {/* Info box */}
      <div className="flex gap-2.5 bg-violet-400/[0.06]
                      border border-violet-400/[0.12]
                      rounded-xl p-3 mb-5 text-xs
                      text-violet-200/70 leading-relaxed">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>
          En mode INDIVIDUEL, chaque animal a sa propre fiche.
          Père et mère permettent la détection automatique de consanguinité.
        </span>
      </div>

      <h1 className="text-lg font-medium text-white mb-1.5">
        Enregistrer un animal
      </h1>
      <p className="text-sm text-white/40 mb-5">
        Fiche individuelle — {espece.nom}.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Numéro"
            placeholder="Ex : TRUIE-2025-048"
            value={form.numero}
            onChange={(e) => handleChange("numero", e.target.value)}
            error={errors.numero}
          />
          <FormField
            label="Nom"
            placeholder="Ex : Rosalie"
            hint="optionnel"
            value={form.nom ?? ""}
            onChange={(e) => handleChange("nom", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            as="select"
            label="Sexe"
            options={[
              { value: "FEMELLE", label: "Femelle" },
              { value: "MALE",    label: "Mâle" },
            ]}
            value={form.sexe}
            onChange={(e) => handleChange("sexe", e.target.value)}
          />
          <FormField
            label="Date de naissance"
            type="date"
            value={form.dateNaissance}
            onChange={(e) => handleChange("dateNaissance", e.target.value)}
            error={errors.dateNaissance}
          />
        </div>

        <FormField
          as="select"
          label="Bâtiment"
          options={[{ value: "", label: "Sélectionner…" }, ...batOptions]}
          value={form.batimentId}
          onChange={(e) => handleChange("batimentId", e.target.value)}
          error={errors.batimentId}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            as="select"
            label="Père"
            hint="optionnel"
            options={maleOptions}
            value={form.pereId ?? ""}
            onChange={(e) => handleChange("pereId", e.target.value)}
          />
          <FormField
            as="select"
            label="Mère"
            hint="optionnel"
            options={femelleOptions}
            value={form.mereId ?? ""}
            onChange={(e) => handleChange("mereId", e.target.value)}
          />
        </div>

        <FormField
          as="select"
          label="Origine"
          options={[
            { value: "ACHAT",          label: "Achat externe" },
            { value: "NAISSANCE_FERME",label: "Naissance en ferme" },
          ]}
          value={form.origine}
          onChange={(e) => handleChange("origine", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-1 bg-green-400 hover:bg-green-300
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-green-950 font-medium rounded-xl text-sm
                     transition-colors"
        >
          {loading ? "Enregistrement…" : "Enregistrer l'animal →"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 bg-transparent border border-white/10
                     text-white/40 hover:text-white/60 rounded-xl text-sm
                     transition-colors"
        >
          ← Retour
        </button>
      </form>
    </div>
  )
}