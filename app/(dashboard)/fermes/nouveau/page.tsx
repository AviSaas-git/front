"use client"

import { useState }      from "react"
import { useRouter }     from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { FormField }     from "@/components/ui/FormField"
import { creerFerme }   from "@/lib/api/fermes"


export default function NouvelleFermePage() {
  const router = useRouter()
  const qc     = useQueryClient()

  const [form, setForm] = useState({
    nom: "", localisation: "", capaciteMax: "", surfaceM2: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.nom.trim()) next.nom = "Nom obligatoire"
    if (!form.capaciteMax || Number(form.capaciteMax) <= 0)
      next.capaciteMax = "Capacité invalide"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await creerFerme({
        nom:         form.nom,
        localisation: form.localisation,
        capaciteMax: Number(form.capaciteMax),
        surfaceM2:   form.surfaceM2 ? Number(form.surfaceM2) : undefined,
      })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      router.push("/dashboard")
    } catch (err: any) {
      setErrors({ nom: err.response?.data?.message ?? "Erreur serveur" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center
                     justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-medium">AviSaaS</span>
        </div>
        <div className="bg-white/[0.03] border border-white/8
                        rounded-2xl p-6">
          <h1 className="text-lg font-medium text-white mb-1.5">
            Nouvelle ferme
          </h1>
          <p className="text-sm text-white/40 mb-6">
            Ajoutez une ferme à votre espace.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              label="Nom de la ferme"
              placeholder="Ex : Ferme Douala Nord"
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              error={errors.nom}
            />
            <FormField
              label="Localisation"
              placeholder="Ville, Région"
              hint="optionnel"
              value={form.localisation}
              onChange={(e) => handleChange("localisation", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Capacité max"
                type="number"
                placeholder="Ex : 10 000"
                value={form.capaciteMax}
                onChange={(e) => handleChange("capaciteMax", e.target.value)}
                error={errors.capaciteMax}
              />
              <FormField
                label="Surface (m²)"
                type="number"
                placeholder="Ex : 600"
                hint="optionnel"
                value={form.surfaceM2}
                onChange={(e) => handleChange("surfaceM2", e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-400 hover:bg-green-300
                         disabled:opacity-40 text-green-950 font-medium
                         rounded-xl text-sm transition-colors mt-1"
            >
              {loading ? "Création…" : "Créer la ferme →"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-2.5 bg-transparent border border-white/10
                         text-white/40 hover:text-white/60 rounded-xl text-sm"
            >
              ← Retour
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}