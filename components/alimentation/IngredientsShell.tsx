"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchIngredients, createIngredient, enregistrerAchat } from "@/lib/api/alimentation"
import { FormField } from "@/components/ui/FormField"

const today = new Date().toISOString().split("T")[0]

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

export function IngredientsShell() {
  const qc = useQueryClient()
  const [ready, setReady]       = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [achatId, setAchatId]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const [form, setForm] = useState({
    nom: "", unite: "kg", prixUnitaireKg: "", fournisseur: "", description: "",
  })
  const [achat, setAchat] = useState({
    date: today, quantiteKg: "", prixUnitaireKg: "", fournisseur: "", observations: "",
  })

  useEffect(() => { setReady(!!localStorage.getItem("avisaas_token")) }, [])

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ["ingredients"], queryFn: fetchIngredients, enabled: ready,
  })

  function h(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })) }
  function ha(field: string, value: string) { setAchat((p) => ({ ...p, [field]: value })) }

  async function handleCreateIngredient(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!form.nom.trim() || !form.prixUnitaireKg) { setError("Nom et prix requis"); return }
    setLoading(true)
    try {
      await createIngredient({
        nom: form.nom, unite: form.unite || undefined,
        prixUnitaireKg: Number(form.prixUnitaireKg),
        fournisseur: form.fournisseur || undefined,
        description: form.description || undefined,
      })
      qc.invalidateQueries({ queryKey: ["ingredients"] })
      setForm({ nom: "", unite: "kg", prixUnitaireKg: "", fournisseur: "", description: "" })
      setShowForm(false)
    } catch (err: any) { setError(err.response?.data?.message ?? "Erreur") }
    finally { setLoading(false) }
  }

  async function handleAchat(e: React.FormEvent) {
    e.preventDefault(); if (!achatId) return; setError("")
    setLoading(true)
    try {
      await enregistrerAchat(achatId, {
        date: achat.date, quantiteKg: Number(achat.quantiteKg),
        prixUnitaireKg: Number(achat.prixUnitaireKg),
        fournisseur: achat.fournisseur || undefined,
        observations: achat.observations || undefined,
      })
      qc.invalidateQueries({ queryKey: ["ingredients"] })
      setAchatId(null)
      setAchat({ date: today, quantiteKg: "", prixUnitaireKg: "", fournisseur: "", observations: "" })
    } catch (err: any) { setError(err.response?.data?.message ?? "Erreur") }
    finally { setLoading(false) }
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Ingrédients" subtitle="Matières premières et prix d'achat" />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="flex justify-end">
            <button onClick={() => setShowForm((v) => !v)}
              className="px-3 py-1.5 bg-green-400 hover:bg-green-300 text-green-950
                         font-medium rounded-lg text-xs transition-colors">
              {showForm ? "Annuler" : "+ Nouvel ingrédient"}
            </button>
          </div>

          {/* Formulaire création */}
          {showForm && (
            <form onSubmit={handleCreateIngredient}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5
                         flex flex-col gap-3">
              <h2 className="text-sm font-medium text-white">Nouvel ingrédient</h2>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nom" placeholder="Ex : Maïs jaune" value={form.nom}
                  onChange={(e) => h("nom", e.target.value)} />
                <FormField label="Unité" placeholder="kg" value={form.unite}
                  onChange={(e) => h("unite", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Prix / kg (FCFA)" type="number" placeholder="Ex : 185"
                  value={form.prixUnitaireKg}
                  onChange={(e) => h("prixUnitaireKg", e.target.value)} />
                <FormField label="Fournisseur" placeholder="Optionnel"
                  hint="optionnel" value={form.fournisseur}
                  onChange={(e) => h("fournisseur", e.target.value)} />
              </div>
              {error && <p className="text-xs text-red-400">⚠ {error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-green-400 disabled:opacity-40
                           text-green-950 font-medium rounded-xl text-sm">
                {loading ? "Création…" : "Créer l'ingrédient"}
              </button>
            </form>
          )}

          {/* Liste */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {ingredients.map((ing) => (
                <div key={ing.id}>
                  <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3
                                  flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/85">{ing.nom}</p>
                      <p className="text-xs text-white/35">
                        {ing.unite ?? "kg"}
                        {ing.fournisseur && ` · ${ing.fournisseur}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white/70">
                        {fcfa(ing.prixUnitaireKg)} / kg
                      </span>
                      <button onClick={() => setAchatId(achatId === ing.id ? null : ing.id)}
                        className="text-[11px] px-2.5 py-1 bg-blue-400/10 hover:bg-blue-400/20
                                   text-blue-300 rounded-lg transition-colors">
                        Enregistrer achat
                      </button>
                    </div>
                  </div>

                  {/* Formulaire achat inline */}
                  {achatId === ing.id && (
                    <form onSubmit={handleAchat}
                      className="bg-blue-400/[0.04] border border-blue-400/15 rounded-xl
                                 px-4 py-4 mt-1 flex flex-col gap-3">
                      <p className="text-xs text-blue-300">
                        Enregistrer un achat — {ing.nom}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <FormField label="Date" type="date" value={achat.date}
                          onChange={(e) => ha("date", e.target.value)} />
                        <FormField label="Quantité (kg)" type="number" placeholder="Ex : 300"
                          value={achat.quantiteKg}
                          onChange={(e) => ha("quantiteKg", e.target.value)} />
                        <FormField label="Prix / kg (FCFA)" type="number" placeholder="Ex : 190"
                          value={achat.prixUnitaireKg}
                          onChange={(e) => ha("prixUnitaireKg", e.target.value)} />
                      </div>
                      <FormField label="Fournisseur" hint="optionnel" value={achat.fournisseur}
                        onChange={(e) => ha("fournisseur", e.target.value)} />

                      {achat.quantiteKg && achat.prixUnitaireKg && (
                        <p className="text-[11px] text-white/35">
                          Total achat :{" "}
                          <span className="text-white/60">
                            {fcfa(Number(achat.quantiteKg) * Number(achat.prixUnitaireKg))} FCFA
                          </span>
                          {" · "}Le nouveau prix ({fcfa(Number(achat.prixUnitaireKg))} /kg)
                          sera appliqué aux prochaines consommations.
                        </p>
                      )}

                      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
                      <div className="flex gap-2">
                        <button type="submit" disabled={loading}
                          className="flex-1 py-2 bg-blue-400/90 hover:bg-blue-400
                                     disabled:opacity-40 text-blue-950 font-medium
                                     rounded-lg text-xs transition-colors">
                          {loading ? "Enregistrement…" : "Confirmer l'achat"}
                        </button>
                        <button type="button" onClick={() => setAchatId(null)}
                          className="px-4 py-2 border border-white/10 text-white/40
                                     hover:text-white/60 rounded-lg text-xs">
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}

              {ingredients.length === 0 && (
                <p className="text-center text-white/30 text-sm py-10">
                  Aucun ingrédient. Créez le maïs, le tourteau de soja, le CMV...
                </p>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}