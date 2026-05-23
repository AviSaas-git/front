"use client"

import { useState }      from "react"
import { useRouter }     from "next/navigation"
import { FormField }     from "@/components/ui/FormField"
import { BATIMENTS_MOCK } from "@/lib/constants/especes"
import type { EspeceConfig, BandeFormData } from "@/lib/types/elevage"
import { demarrerElevage } from "@/lib/api/elevages"

type Props = {
  espece: EspeceConfig
  onBack: () => void
}

type BandeErrors = Partial<Record<keyof BandeFormData, string>>

const today = new Date().toISOString().split("T")[0]

export function StepFormBande({ espece, onBack }: Props) {
  const router = useRouter()

  const [form, setForm] = useState<BandeFormData>({
    especeId:        espece.id,
    batimentId:      "",
    effectifInitial: 0,
    race:            "",
    dateArrivee:     today,
    fournisseur:     "",
  })

  const [errors, setErrors]   = useState<BandeErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof BandeFormData, value: string) {
    const parsed =
      field === "effectifInitial" ? Number(value) : value

    setForm((prev) => ({ ...prev, [field]: parsed }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: BandeErrors = {}

    if (!form.batimentId)
      next.batimentId = "Sélectionnez un bâtiment"

    if (!form.effectifInitial || form.effectifInitial <= 0)
      next.effectifInitial = "Effectif invalide"

    // Vérifie que l'effectif ne dépasse pas la capacité
    const bat = BATIMENTS_MOCK.find((b) => b.id === form.batimentId)
    if (bat && form.effectifInitial > bat.capacite) {
      next.effectifInitial =
        `Dépasse la capacité du bâtiment (${bat.capacite} places)`
    }

    if (!form.dateArrivee)
      next.dateArrivee = "Date obligatoire"

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
      setErrors({ batimentId: "Erreur serveur. Réessayez." })
    } finally {
      setLoading(false)
    }
  }

  const batimentOptions = BATIMENTS_MOCK.map((b) => ({
    value: b.id,
    label: `${b.nom} — ${b.capacite} places`,
  }))

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
                      bg-blue-400/8 border border-blue-400/15
                      text-blue-300 px-3 py-1 rounded-full
                      text-xs font-medium mb-4">
        <span>{espece.icon}</span>
        <span>{espece.nom} · Mode LOT</span>
      </div>

      {/* Info box */}
      <div className="flex gap-2.5 bg-blue-400/[0.06]
                      border border-blue-400/[0.12]
                      rounded-xl p-3 mb-5 text-xs
                      text-blue-200/70 leading-relaxed">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>
          En mode LOT, vous gérez un groupe d&apos;oiseaux ensemble.
          Saisissez l&apos;effectif total à l&apos;arrivée des poussins.
        </span>
      </div>

      <h1 className="text-lg font-medium text-white mb-1.5">
        Nouvelle bande
      </h1>
      <p className="text-sm text-white/40 mb-5">
        Informations de base de votre bande de {espece.nom}.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

        <FormField
          as="select"
          label="Bâtiment d'accueil"
          options={[{ value: "", label: "Sélectionner un bâtiment…" }, ...batimentOptions]}
          value={form.batimentId}
          onChange={(e) => handleChange("batimentId", e.target.value)}
          error={errors.batimentId}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Effectif initial"
            type="number"
            placeholder="Ex : 5 000"
            value={form.effectifInitial || ""}
            onChange={(e) => handleChange("effectifInitial", e.target.value)}
            error={errors.effectifInitial}
          />
          <FormField
            label="Race"
            placeholder="Ex : Cobb 500"
            hint="optionnel"
            value={form.race ?? ""}
            onChange={(e) => handleChange("race", e.target.value)}
          />
        </div>

        <FormField
          label="Date d'arrivée des poussins"
          type="date"
          value={form.dateArrivee}
          onChange={(e) => handleChange("dateArrivee", e.target.value)}
          error={errors.dateArrivee}
        />

        <FormField
          label="Fournisseur couvoir"
          placeholder="Ex : Couvoir du Wouri"
          hint="optionnel"
          value={form.fournisseur ?? ""}
          onChange={(e) => handleChange("fournisseur", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-1 bg-green-400 hover:bg-green-300
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-green-950 font-medium rounded-xl text-sm
                     transition-colors"
        >
          {loading ? "Création en cours…" : "Créer la bande →"}
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