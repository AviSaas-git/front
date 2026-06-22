"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { FormField } from "@/components/ui/FormField"
import { fetchEspeces } from "@/lib/api/bandes"
import { fetchReproducteurs } from "@/lib/api/animaux"
import { createReproduction } from "@/lib/api/reproduction"

const today = new Date().toISOString().split("T")[0]

export function NouvelleSaillieForm() {
  const router = useRouter()
  const [especeId, setEspeceId] = useState("")
  const [form, setForm] = useState({
    femelleId: "", maleId: "", dateSaillie: today, observations: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const { data: especes = [] } = useQuery({ queryKey: ["especes"], queryFn: fetchEspeces })

  const especesReproduction = especes.filter(
    (e) => e.modeGestion === "INDIVIDUEL" && e.gererReproduction
  )

  const { data: femelles = [] } = useQuery({
    queryKey: ["reproducteurs", especeId, "FEMELLE"],
    queryFn:  () => fetchReproducteurs(especeId, "FEMELLE"),
    enabled:  !!especeId,
  })

  const { data: males = [] } = useQuery({
    queryKey: ["reproducteurs", especeId, "MALE"],
    queryFn:  () => fetchReproducteurs(especeId, "MALE"),
    enabled:  !!especeId,
  })

  function h(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.femelleId) { setError("Sélectionnez une femelle"); return }

    setLoading(true)
    try {
      await createReproduction({
        femelleId: form.femelleId,
        maleId: form.maleId || undefined,
        dateSaillie: form.dateSaillie,
        observations: form.observations || undefined,
      })
      router.push("/reproduction")
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  const especeChoisie = especesReproduction.find((e) => e.id === especeId)

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-medium">AviSaaS</span>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h1 className="text-lg font-medium text-white mb-1.5">Nouvelle saillie</h1>
          <p className="text-sm text-white/40 mb-5">
            La date de mise bas est calculée automatiquement selon la durée
            de gestation de l'espèce.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

            <FormField as="select" label="Espèce"
              options={[
                { value: "", label: "Sélectionner…" },
                ...especesReproduction.map((e) => ({
                  value: e.id, label: `${e.icon} ${e.nom} (gestation ${e.dureeGestationJours}j)`,
                })),
              ]}
              value={especeId}
              onChange={(e) => { setEspeceId(e.target.value); h("femelleId", ""); h("maleId", "") }}
            />

            {especeId && (
              <>
                <FormField as="select" label="Femelle"
                  options={[
                    { value: "", label: femelles.length ? "Sélectionner…" : "Aucune femelle disponible" },
                    ...femelles.map((f) => ({ value: f.id, label: `${f.numero}${f.nom ? ` (${f.nom})` : ""}` })),
                  ]}
                  value={form.femelleId}
                  onChange={(e) => h("femelleId", e.target.value)}
                />

                <FormField as="select" label="Mâle" hint="optionnel — IA ou inconnu"
                  options={[
                    { value: "", label: "— IA / inconnu" },
                    ...males.map((m) => ({ value: m.id, label: `${m.numero}${m.nom ? ` (${m.nom})` : ""}` })),
                  ]}
                  value={form.maleId}
                  onChange={(e) => h("maleId", e.target.value)}
                />
              </>
            )}

            <FormField label="Date de saillie" type="date"
              value={form.dateSaillie} onChange={(e) => h("dateSaillie", e.target.value)} />

            {especeChoisie && form.dateSaillie && (
              <p className="text-[11px] text-white/30">
                Mise bas prévue le{" "}
                <span className="text-white/60">
                  {new Date(
                    new Date(form.dateSaillie).getTime() +
                    especeChoisie.dureeGestationJours * 86400000
                  ).toLocaleDateString("fr-FR")}
                </span>
              </p>
            )}

            <FormField label="Observations" placeholder="Ex : Saillie naturelle"
              hint="optionnel" value={form.observations}
              onChange={(e) => h("observations", e.target.value)} />

            {error && <p className="text-xs text-red-400">⚠ {error}</p>}

            <button type="submit" disabled={loading || !especeId}
              className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                         text-green-950 font-medium rounded-xl text-sm transition-colors mt-1">
              {loading ? "Enregistrement…" : "Enregistrer la saillie →"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="w-full py-2.5 bg-transparent border border-white/10
                         text-white/40 hover:text-white/60 rounded-xl text-sm transition-colors">
              ← Retour
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}