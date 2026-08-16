"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchIngredients, fetchFormulas, createFormula } from "@/lib/api/alimentation"
import { FormField } from "@/components/ui/FormField"

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

type LigneForm = { ingredientId: string; proportionPour100kg: string }

const PHASES = [
  { value: "DEMARRAGE", label: "Démarrage (0-21j)" },
  { value: "CROISSANCE", label: "Croissance (22-42j)" },
  { value: "FINITION",   label: "Finition (43j+)" },
  { value: "UNIQUE",     label: "Phase unique" },
  { value: "GESTATION",  label: "Gestation" },
  { value: "LACTATION",  label: "Lactation / allaitement" },
]

export function FormulasShell() {
  const qc = useQueryClient()
  const [ready, setReady]       = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const [nom, setNom]         = useState("")
  const [phase, setPhase]     = useState("UNIQUE")
  const [desc, setDesc]       = useState("")
  const [lignes, setLignes]   = useState<LigneForm[]>([
    { ingredientId: "", proportionPour100kg: "" }
  ])

  useEffect(() => { setReady(!!localStorage.getItem("avisaas_token")) }, [])

  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredients"], queryFn: fetchIngredients, enabled: ready,
  })
  const { data: formulas = [], isLoading } = useQuery({
    queryKey: ["formulas"], queryFn: fetchFormulas, enabled: ready,
  })

  function updateLigne(i: number, field: keyof LigneForm, value: string) {
    setLignes((p) => { const n = [...p]; n[i] = { ...n[i], [field]: value }; return n })
  }

  const totalProportion = lignes.reduce((s, l) => s + (Number(l.proportionPour100kg) || 0), 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!nom.trim()) { setError("Nom obligatoire"); return }
    const comp = lignes.filter((l) => l.ingredientId && l.proportionPour100kg)
      .map((l) => ({ ingredientId: l.ingredientId, proportionPour100kg: Number(l.proportionPour100kg) }))
    if (comp.length === 0) { setError("Ajoutez au moins un ingrédient"); return }

    setLoading(true)
    try {
      await createFormula({ nom, description: desc, phase, composition: comp })
      qc.invalidateQueries({ queryKey: ["formulas"] })
      setNom(""); setPhase("UNIQUE"); setDesc("")
      setLignes([{ ingredientId: "", proportionPour100kg: "" }])
      setShowForm(false)
    } catch (err: any) { setError(err.response?.data?.message ?? "Erreur") }
    finally { setLoading(false) }
  }

  const ingOptions = [
    { value: "", label: "Sélectionner un ingrédient…" },
    ...ingredients.map((i) => ({ value: i.id, label: `${i.nom} — ${fcfa(i.prixUnitaireKg)}/kg` })),
  ]

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Formules d'aliment" subtitle="Compositions et prix de revient" />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="flex justify-end">
            <button onClick={() => setShowForm((v) => !v)}
              className="px-3 py-1.5 bg-green-400 hover:bg-green-300 text-green-950
                         font-medium rounded-lg text-xs transition-colors">
              {showForm ? "Annuler" : "+ Nouvelle formule"}
            </button>
          </div>

          {/* Formulaire création */}
          {showForm && (
            <form onSubmit={handleSubmit}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5
                         flex flex-col gap-4">
              <h2 className="text-sm font-medium text-white">Nouvelle formule</h2>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nom de la formule" placeholder="Ex : Démarrage poulet"
                  value={nom} onChange={(e) => setNom(e.target.value)} />
                <FormField as="select" label="Phase d'élevage"
                  options={PHASES} value={phase}
                  onChange={(e) => setPhase(e.target.value)} />
              </div>

              <FormField label="Description" hint="optionnel" value={desc}
                onChange={(e) => setDesc(e.target.value)} />

              {/* Composition */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/50">Composition (pour 100 kg de mélange)</p>
                  <span className={`text-xs font-mono ${
                    Math.abs(totalProportion - 100) < 1 ? "text-green-400" : "text-amber-400"
                  }`}>
                    Σ = {totalProportion.toFixed(1)} kg
                    {Math.abs(totalProportion - 100) < 1 ? " ✓" : " ≠ 100"}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {lignes.map((l, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <FormField as="select" label={i === 0 ? "Ingrédient" : ""}
                          options={ingOptions}
                          value={l.ingredientId}
                          onChange={(e) => updateLigne(i, "ingredientId", e.target.value)} />
                      </div>
                      <div className="w-28">
                        <FormField label={i === 0 ? "Quantité (kg)" : ""}
                          type="number" placeholder="Ex : 55"
                          value={l.proportionPour100kg}
                          onChange={(e) => updateLigne(i, "proportionPour100kg", e.target.value)} />
                      </div>
                      {lignes.length > 1 && (
                        <button type="button"
                          onClick={() => setLignes((p) => p.filter((_, j) => j !== i))}
                          className="text-white/30 hover:text-red-400 pb-1 text-lg">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button"
                  onClick={() => setLignes((p) => [...p, { ingredientId: "", proportionPour100kg: "" }])}
                  className="mt-2 w-full py-2 border border-dashed border-white/15
                             text-white/40 hover:text-white/60 rounded-lg text-xs transition-colors">
                  + Ajouter un ingrédient
                </button>
              </div>

              {error && <p className="text-xs text-red-400">⚠ {error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-green-400 disabled:opacity-40
                           text-green-950 font-medium rounded-xl text-sm">
                {loading ? "Création…" : "Créer la formule"}
              </button>
            </form>
          )}

          {/* Liste des formules */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {formulas.map((f) => (
                <div key={f.id}
                  className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                    <div>
                      <p className="text-sm text-white/85">{f.nom}</p>
                      <p className="text-xs text-white/35">
                        {f.phase} · {f.composition.length} ingrédients
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        Math.abs(f.proportionTotale - 100) > 1
                          ? "text-amber-400" : "text-white/70"
                      }`}>
                        {fcfa(f.prixRevientKg)} / kg
                      </span>
                      <span className="text-white/30 text-xs">
                        {expanded === f.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {expanded === f.id && (
                    <div className="border-t border-white/[0.06] px-4 py-3">
                      {Math.abs(f.proportionTotale - 100) > 1 && (
                        <p className="text-xs text-amber-300 mb-3">
                          ⚠ Total = {f.proportionTotale.toFixed(1)} kg — devrait être 100 kg
                        </p>
                      )}
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr>
                            {["Ingrédient","Quantité / 100 kg","Prix / kg","Coût contribution"].map((h) => (
                              <th key={h} className="text-left pb-2 text-white/30 font-medium
                                                     border-b border-white/[0.06]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {f.composition.map((l) => (
                            <tr key={l.ingredientId}
                              className="border-b border-white/[0.04] last:border-0">
                              <td className="py-2 text-white/70">{l.ingredientNom}</td>
                              <td className="py-2 text-white/50">{l.proportionPour100kg} kg</td>
                              <td className="py-2 text-white/50">{fcfa(l.prixIngredientKg)} / kg</td>
                              <td className="py-2 text-white/70 font-medium">
                                {fcfa(l.coutContribution)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="pt-2 text-white/40 text-right font-medium">
                              Prix de revient / kg :
                            </td>
                            <td className="pt-2 text-green-400 font-medium">
                              {fcfa(f.prixRevientKg)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {formulas.length === 0 && (
                <p className="text-center text-white/30 text-sm py-10">
                  Aucune formule. Commencez par créer vos ingrédients puis composez une formule.
                </p>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}