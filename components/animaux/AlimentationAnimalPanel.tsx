// Nouveau fichier : components/animaux/AlimentationAnimalPanel.tsx
"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormField } from "@/components/ui/FormField"
import { fetchFormulas } from "@/lib/api/alimentation"
import { fetchAlimentationAnimal, createConsommationAnimal } from "@/lib/api/alimentation"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

const today = new Date().toISOString().split("T")[0]
function fcfa(n: number) { return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F" }

export function AlimentationAnimalPanel({ animalId }: { animalId: string }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ date: today, formulaId: "", quantiteKg: "", observations: "" })
  const [loading, setLoading] = useState(false)

  const { data: formulas = [] } = useQuery({ queryKey: ["formulas"], queryFn: fetchFormulas })
  const { data: alimentation, isLoading } = useQuery({
    queryKey: ["alimentation-animal", animalId],
    queryFn: () => fetchAlimentationAnimal(animalId),
  })

  function h(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.formulaId || !form.quantiteKg) {
      toastError("Sélectionnez une formule et une quantité.")
      return
    }
    setLoading(true)
    try {


      console.log("entre dans la fonction")
      const res = await createConsommationAnimal(animalId, {
        date: form.date, formulaId: form.formulaId,
        quantiteKg: Number(form.quantiteKg),
        observations: form.observations || undefined,
      })
      console.log("Résultat de la création :", res)
      toastSuccess(`Distribution enregistrée — ${fcfa(res.coutTotal)}`)
      qc.invalidateQueries({ queryKey: ["alimentation-animal", animalId] })
      setForm({ date: today, formulaId: "", quantiteKg: "", observations: "" })
    } catch (err: any) {
      toastError(traduireErreur(err))
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) return <div className="h-32 bg-white/[0.03] rounded-xl animate-pulse" />

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-1">Alimentation</h2>
          <p className="text-xs text-white/40 mb-4">
            {alimentation && `${alimentation.totalKgConsommes.toFixed(1)} kg consommés · ${fcfa(alimentation.coutTotalAlimentation)} au total`}
          </p>

          {formulas.length === 0 ? (
            <div className="bg-amber-400/[0.06] border border-amber-400/15 rounded-xl px-4 py-3 text-xs text-amber-300">
              Aucune formule disponible.{" "} fgdgfgfgdfgfdg
              <a href="/alimentation/formulas" className="underline">Créer une formule →</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FormField label="Date" type="date" value={form.date}
                onChange={(e) => h("date", e.target.value)} />
              <FormField as="select" label="Formule"
                options={[{ value: "", label: "Sélectionner…" },
                  ...formulas.map((f) => ({ value: f.id, label: `${f.nom} — ${fcfa(f.prixRevientKg)}/kg` }))]}
                value={form.formulaId} onChange={(e) => h("formulaId", e.target.value)} />
              <FormField label="Quantité (kg)" type="number" placeholder="Ex : 2.5"
                value={form.quantiteKg} onChange={(e) => h("quantiteKg", e.target.value)} />
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                          text-green-950 font-medium rounded-xl text-sm">
                {loading ? "Enregistrement…" : "Enregistrer la distribution"}
              </button>
            </form>
          )}

        
        </div> 
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            Historique alimentation
          </h2>

        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
        {alimentation && alimentation.historique.length > 0 && (
                <div className="mt-4 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {alimentation.historique.map((c) => (
                    <div key={c.id} className="flex justify-between px-3 py-2 bg-white/[0.02] rounded-lg text-xs">
                       <span className="text-white/70">{c.date}</span>
                      <span className="text-white/60">{c.formulaNom} · {c.quantiteKg}kg</span>
                      <span className="text-white/70">{fcfa(c.coutTotal)}</span>
                    </div>
                  ))}
                </div>
              )}
        </div>
    
    </div>

    </div>
  )
}