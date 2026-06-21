"use client"

import { useState }        from "react"
import { useRouter }       from "next/navigation"
import { useQuery }        from "@tanstack/react-query"
import { useQueryClient }  from "@tanstack/react-query"
import { FormField }       from "@/components/ui/FormField"
import { createBande }     from "@/lib/api/bandes"
import { fetchBatiments }  from "@/lib/api/batiments"
import type { EspeceRef }  from "@/lib/api/bandes"
import type { BandeFormData } from "@/lib/types/elevage"

type Props = {
  espece: EspeceRef
  onBack: () => void
}

const today = new Date().toISOString().split("T")[0]

export function StepFormBande({ espece, onBack }: Props) {
  const router       = useRouter()
  const queryClient  = useQueryClient()

  const [form, setForm] = useState<BandeFormData>({
    especeId:        espece.id,
    batimentId:      "",
    effectifInitial: 0,
    race:            "",
    dateArrivee:     today,
    fournisseur:     "",
  })

  const [errors, setErrors]   = useState<Partial<BandeFormData>>({})
  const [loading, setLoading] = useState(false)

  // Charge les vrais bâtiments depuis l'API
  const { data: batiments = [] } = useQuery({
    queryKey: ["batiments"],
    queryFn:  fetchBatiments,
  })


//console.log("BATIMENTS =", batiments)

  function handleChange(field: keyof BandeFormData, value: string) {
    const parsed = field === "effectifInitial" ? Number(value) : value
    setForm((prev) => ({ ...prev, [field]: parsed }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const next: Partial<BandeFormData> = {}
    if (!form.batimentId)           next.batimentId = "Sélectionnez un bâtiment"
    if (!form.effectifInitial || form.effectifInitial <= 0) 
      next.effectifInitial = "Effectif invalide"
    const bat = batiments.find((b) => b.id === form.batimentId)
    if (bat && form.effectifInitial > bat.capacite)
      next.effectifInitial = `Dépasse la capacité (${bat.capacite} places)`
    if (!form.dateArrivee)          next.dateArrivee = "Date obligatoire"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await createBande({
        especeId:        form.especeId,
        batimentId:      form.batimentId,
        effectifInitial: form.effectifInitial,
        race:            form.race ?? "",
        dateArrivee:     form.dateArrivee,
        fournisseur:     form.fournisseur ?? "",
      })
      // Invalide le cache dashboard pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["bandes"] })
      router.push("/dashboard")
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Erreur serveur."
      alert("le batiment est peut-etre deja occuper: verifier")

      setErrors({ batimentId: msg })
      
    } finally {
      setLoading(false)
    }
  }

  const batimentOptions = [
    { value: "", label: "Sélectionner un bâtiment…" },
    ...batiments.map((b) => ({
      value: b.id,
      label: `${b.nom} — ${b.capacite} places`,
    })),
  ]

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <div className="flex gap-1.5 mb-4">
        <div className="flex-1 h-px bg-green-400 rounded-full" />
        <div className="flex-1 h-px bg-green-400 rounded-full" />
      </div>
      <p className="text-[11px] text-white/30 mb-4">
        Étape <span className="text-white/60 font-medium">2</span> sur{" "}
        <span className="text-white/60 font-medium">2</span>
      </p>

      <div className="inline-flex items-center gap-2 bg-blue-400/8
                      border border-blue-400/15 text-blue-300 px-3 py-1
                      rounded-full text-xs font-medium mb-4">
        <span>{espece.icon}</span>
        <span>{espece.nom} · Mode LOT</span>
      </div>

      <div className="flex gap-2.5 bg-blue-400/[0.06] border
                      border-blue-400/[0.12] rounded-xl p-3 mb-5
                      text-xs text-blue-200/70 leading-relaxed">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>
          Mode LOT : vous gérez un groupe d'oiseaux ensemble.
          Saisissez l'effectif total à l'arrivée.
        </span>
      </div>

      <h1 className="text-lg font-medium text-white mb-1.5">
        Nouvelle bande
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <FormField
          as="select"
          label="Bâtiment d'accueil"
          options={batimentOptions}
          value={form.batimentId}
          onChange={(e) => handleChange("batimentId", e.target.value)}
          error={errors.batimentId as string}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Effectif initial"
            type="number"
            placeholder="Ex : 5 000"
            value={form.effectifInitial || ""}
            onChange={(e) => handleChange("effectifInitial", e.target.value)}
            error={errors.effectifInitial as string}
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
          label="Date d'arrivée"
          type="date"
          value={form.dateArrivee}
          onChange={(e) => handleChange("dateArrivee", e.target.value)}
          error={errors.dateArrivee as string}
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