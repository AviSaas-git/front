"use client"

import { useState }         from "react"
import { useRouter }        from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormField }        from "@/components/ui/FormField"
import { creerBatiment } from "@/lib/api/batiments"
import { apiClient }        from "@/lib/api/client"

async function fetchFermes() {
  const res = await apiClient.get("/api/v1/fermes")
  return res.data as { id: string; nom: string }[]
}

export default function NouveauBatimentPage() {
  const router = useRouter()
  const qc     = useQueryClient()

  const { data: fermes = [] } = useQuery({
    queryKey: ["fermes"],
    queryFn:  fetchFermes,
  })

  const [form, setForm] = useState({
    nom: "", capacite: "", surfaceM2: "",
    type: "poulailler", typeChauffage: "aucun", fermeId: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.nom.trim())  next.nom      = "Nom obligatoire"
    if (!form.fermeId)     next.fermeId  = "Sélectionnez une ferme"
    if (!form.capacite || Number(form.capacite) <= 0)
      next.capacite = "Capacité invalide"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await creerBatiment({
        fermeId:      form.fermeId,
        nom:          form.nom,
        capacite:     Number(form.capacite),
        surfaceM2:    form.surfaceM2 ? Number(form.surfaceM2) : undefined,
        type:         form.type,
        typeChauffage: form.typeChauffage,
      })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      qc.invalidateQueries({ queryKey: ["batiments"] })
      router.push("/dashboard")
    } catch (err: any) {
      setErrors({ nom: err.response?.data?.message ?? "Erreur serveur" })
    } finally {
      setLoading(false)
    }
  }

  const fermeOptions = [
    { value: "", label: "Sélectionner une ferme…" },
    ...fermes.map((f) => ({ value: f.id, label: f.nom })),
  ]

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
            Nouveau bâtiment
          </h1>
          <p className="text-sm text-white/40 mb-6">
            Ajoutez un bâtiment à l'une de vos fermes.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              as="select"
              label="Ferme"
              options={fermeOptions}
              value={form.fermeId}
              onChange={(e) => handleChange("fermeId", e.target.value)}
              error={errors.fermeId}
            />
            <FormField
              label="Nom du bâtiment"
              placeholder="Ex : Bâtiment B"
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              error={errors.nom}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Capacité (places)"
                type="number"
                placeholder="Ex : 5 000"
                value={form.capacite}
                onChange={(e) => handleChange("capacite", e.target.value)}
                error={errors.capacite}
              />
              <FormField
                label="Surface (m²)"
                type="number"
                placeholder="Ex : 200"
                hint="optionnel"
                value={form.surfaceM2}
                onChange={(e) => handleChange("surfaceM2", e.target.value)}
              />
            </div>
            <FormField
              as="select"
              label="Type"
              options={[
                { value: "poulailler", label: "Poulailler" },
                { value: "porcherie",  label: "Porcherie" },
                { value: "clapier",    label: "Clapier (lapins)" },
                { value: "polyvalent", label: "Polyvalent" },
              ]}
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
            <FormField
              as="select"
              label="Chauffage"
              hint="optionnel"
              options={[
                { value: "aucun",      label: "Aucun" },
                { value: "gaz",        label: "Gaz propane" },
                { value: "electrique", label: "Électrique" },
                { value: "bois",       label: "Bois" },
              ]}
              value={form.typeChauffage}
              onChange={(e) => handleChange("typeChauffage", e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-400 hover:bg-green-300
                         disabled:opacity-40 text-green-950 font-medium
                         rounded-xl text-sm transition-colors mt-1"
            >
              {loading ? "Création…" : "Créer le bâtiment →"}
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