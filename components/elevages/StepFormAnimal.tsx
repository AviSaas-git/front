"use client"

import { useState, useEffect }          from "react"
import { useRouter }                    from "next/navigation"
import { useQuery, useQueryClient }     from "@tanstack/react-query"
import { FormField }                    from "@/components/ui/FormField"
import { createAnimal, fetchReproducteurs } from "@/lib/api/animaux"
import { fetchBatiments }               from "@/lib/api/batiments"
import type { EspeceRef }               from "@/lib/api/bandes"

type Props = {
  espece: EspeceRef
  onBack: () => void
}

export function StepFormAnimal({ espece, onBack }: Props) {
  const router = useRouter()
  const qc     = useQueryClient()

  const [form, setForm] = useState({
    especeId:      espece.id,
    batimentId:    "",
    numero:        "",
    nom:           "",
    sexe:          "FEMELLE",
    dateNaissance: "",
    origine:       "ACHAT",
    poidsActuelKg: "",
    pereId:        "",
    mereId:        "",
  })
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [loading, setLoading]       = useState(false)
  const [consanguinAlert, setConsanguinAlert] = useState(false)

  const { data: batiments = [] } = useQuery({
    queryKey: ["batiments"],
    queryFn:  fetchBatiments,
  })

  const { data: males = [] } = useQuery({
    queryKey: ["reproducteurs", espece.id, "MALE"],
    queryFn:  () => fetchReproducteurs(espece.id, "MALE"),
  })

  const { data: femelles = [] } = useQuery({
    queryKey: ["reproducteurs", espece.id, "FEMELLE"],
    queryFn:  () => fetchReproducteurs(espece.id, "FEMELLE"),
  })

  useEffect(() => {
    if (!form.pereId || !form.mereId) {
      setConsanguinAlert(false)
      return
    }
    const pere = males.find((m) => m.id === form.pereId)
    const mere = femelles.find((f) => f.id === form.mereId)
    if (pere && mere) {
      const gpP = [pere.pereNumero, pere.mereNumero].filter(Boolean)
      const gpM = [mere.pereNumero, mere.mereNumero].filter(Boolean)
      setConsanguinAlert(gpP.some((g) => gpM.includes(g as string)))
    }
  }, [form.pereId, form.mereId, males, femelles])

  function handleChange(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.numero.trim()) next.numero       = "Le numéro est obligatoire"
    if (!form.batimentId)    next.batimentId    = "Sélectionnez un bâtiment"
    if (!form.dateNaissance) next.dateNaissance = "Date de naissance obligatoire"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createAnimal({
        especeId:      form.especeId,
        batimentId:    form.batimentId,
        numero:        form.numero,
        nom:           form.nom || undefined,
        sexe:          form.sexe,
        dateNaissance: form.dateNaissance,
        origine:       form.origine,
        poidsActuelKg: form.poidsActuelKg ? Number(form.poidsActuelKg) : undefined,
        pereId:        form.pereId || undefined,
        mereId:        form.mereId || undefined,
      })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      qc.invalidateQueries({ queryKey: ["animaux"] })
      router.push("/dashboard")
    } catch (err: any) {
      setErrors({ numero: err.response?.data?.message ?? "Erreur serveur." })
    } finally {
      setLoading(false)
    }
  }

  const batimentOptions = [
    { value: "", label: "Sélectionner un bâtiment…" },
    ...batiments.map((b) => ({ value: b.id, label: `${b.nom} — ${b.capacite} places` })),
  ]

  const maleOptions = [
    { value: "", label: "— Inconnu / achat externe" },
    ...males.map((a) => ({ value: a.id, label: `${a.numero}${a.nom ? ` (${a.nom})` : ""}` })),
  ]

  const femelleOptions = [
    { value: "", label: "— Inconnue / achat externe" },
    ...femelles.map((a) => ({ value: a.id, label: `${a.numero}${a.nom ? ` (${a.nom})` : ""}` })),
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

      <div className="inline-flex items-center gap-2 bg-violet-400/8
                      border border-violet-400/15 text-violet-300
                      px-3 py-1 rounded-full text-xs font-medium mb-4">
        <span>{espece.icon}</span>
        <span>{espece.nom} · Mode INDIVIDUEL</span>
      </div>

      <div className="flex gap-2.5 bg-violet-400/[0.06] border
                      border-violet-400/[0.12] rounded-xl p-3 mb-4
                      text-xs text-violet-200/70 leading-relaxed">
        <span className="shrink-0">ℹ</span>
        <span>
          Chaque animal a sa propre fiche. Père et mère permettent
          la détection automatique de consanguinité.
        </span>
      </div>

      {consanguinAlert && (
        <div className="flex gap-2.5 bg-amber-400/[0.08] border
                        border-amber-400/[0.2] rounded-xl p-3 mb-4
                        text-xs text-amber-300 leading-relaxed">
          <span className="shrink-0">⚠</span>
          <span>
            <b>Attention — risque de consanguinité détecté.</b>
            {" "}Ces deux parents partagent des ancêtres communs.
          </span>
        </div>
      )}

      <h1 className="text-lg font-medium text-white mb-4">
        Enregistrer un animal
      </h1>

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
            value={form.nom}
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
          options={batimentOptions}
          value={form.batimentId}
          onChange={(e) => handleChange("batimentId", e.target.value)}
          error={errors.batimentId}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Poids actuel (kg)"
            type="number"
            placeholder="Ex : 45.5"
            hint="optionnel"
            value={form.poidsActuelKg}
            onChange={(e) => handleChange("poidsActuelKg", e.target.value)}
          />
          <FormField
            as="select"
            label="Origine"
            options={[
              { value: "ACHAT",           label: "Achat externe" },
              { value: "NAISSANCE_FERME", label: "Naissance en ferme" },
            ]}
            value={form.origine}
            onChange={(e) => handleChange("origine", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[10px] text-white/25 whitespace-nowrap">
            GÉNÉALOGIE
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            as="select"
            label="Père"
            hint="optionnel"
            options={maleOptions}
            value={form.pereId}
            onChange={(e) => handleChange("pereId", e.target.value)}
          />
          <FormField
            as="select"
            label="Mère"
            hint="optionnel"
            options={femelleOptions}
            value={form.mereId}
            onChange={(e) => handleChange("mereId", e.target.value)}
          />
        </div>

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