"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { FormField } from "@/components/ui/FormField"
import { fetchStockItems, createStockItem, enregistrerMouvement } from "@/lib/api/stock"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

const today = new Date().toISOString().split("T")[0]
function fcfa(n: number) { return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F" }

const CATEGORIES = [
  { value: "MEDICAMENT",  label: "💊 Médicament" },
  { value: "MATERIEL",    label: "🔧 Matériel" },
  { value: "EQUIPEMENT",  label: "⚙ Équipement" },
  { value: "CONSOMMABLE", label: "📦 Consommable" },
  { value: "EMBALLAGE",   label: "🧰 Emballage" },
]

export function StockShell() {
  const qc = useQueryClient()
  const [ready, setReady] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [mvtItem, setMvtItem] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nom: "", categorie: "CONSOMMABLE", unite: "", quantiteActuelle: "",
    seuilAlerte: "", prixUnitaire: "", fournisseur: "",
  })
  const [mvt, setMvt] = useState({ date: today, type: "ENTREE", quantite: "", motif: "" })

  useEffect(() => { setReady(!!localStorage.getItem("avisaas_token")) }, [])

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["stock-items"], queryFn: fetchStockItems, enabled: ready,
  })

  function h(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })) }
  function hm(f: string, v: string) { setMvt((p) => ({ ...p, [f]: v })) }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nom.trim()) { toastError("Le nom est obligatoire"); return }
    setLoading(true)
    try {
      await createStockItem({
        nom: form.nom, categorie: form.categorie, unite: form.unite || undefined,
        quantiteActuelle: Number(form.quantiteActuelle) || 0,
        seuilAlerte: Number(form.seuilAlerte) || 0,
        prixUnitaire: Number(form.prixUnitaire) || 0,
        fournisseur: form.fournisseur || undefined,
      })
      qc.invalidateQueries({ queryKey: ["stock-items"] })
      toastSuccess(`"${form.nom}" ajouté au stock.`)
      setForm({ nom: "", categorie: "CONSOMMABLE", unite: "", quantiteActuelle: "",
                seuilAlerte: "", prixUnitaire: "", fournisseur: "" })
      setShowForm(false)
    } catch (err: any) { toastError(traduireErreur(err)) }
    finally { setLoading(false) }
  }

  async function handleMouvement(e: React.FormEvent) {
    e.preventDefault()
    if (!mvtItem || !mvt.quantite) { toastError("Quantité requise"); return }
    setLoading(true)
    try {
      await enregistrerMouvement(mvtItem, {
        date: mvt.date, type: mvt.type, quantite: Number(mvt.quantite),
        motif: mvt.motif || undefined,
      })
      qc.invalidateQueries({ queryKey: ["stock-items"] })
      toastSuccess(`Mouvement enregistré.`)
      setMvtItem(null)
      setMvt({ date: today, type: "ENTREE", quantite: "", motif: "" })
    } catch (err: any) { toastError(traduireErreur(err)) }
    finally { setLoading(false) }
  }

  const enAlerte = items.filter((i) => i.enAlerte)

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Stock" subtitle="Médicaments, matériel, consommables" />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {enAlerte.length > 0 && (
            <div className="bg-amber-400/[0.07] border border-amber-400/18 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-300 font-medium mb-1">
                ⚠ {enAlerte.length} article{enAlerte.length > 1 ? "s" : ""} en alerte stock bas
              </p>
              <p className="text-[11px] text-amber-300/70">
                {enAlerte.map((i) => i.nom).join(", ")}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={() => setShowForm((v) => !v)}
              className="px-3 py-1.5 bg-green-400 hover:bg-green-300 text-green-950
                         font-medium rounded-lg text-xs transition-colors">
              {showForm ? "Annuler" : "+ Nouvel article"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nom" placeholder="Ex : Seringues 5ml" value={form.nom}
                  onChange={(e) => h("nom", e.target.value)} />
                <FormField as="select" label="Catégorie" options={CATEGORIES}
                  value={form.categorie} onChange={(e) => h("categorie", e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Quantité actuelle" type="number" value={form.quantiteActuelle}
                  onChange={(e) => h("quantiteActuelle", e.target.value)} />
                <FormField label="Seuil alerte" type="number" value={form.seuilAlerte}
                  onChange={(e) => h("seuilAlerte", e.target.value)} />
                <FormField label="Unité" placeholder="unité, kg…" value={form.unite}
                  onChange={(e) => h("unite", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Prix unitaire (FCFA)" type="number" hint="optionnel"
                  value={form.prixUnitaire} onChange={(e) => h("prixUnitaire", e.target.value)} />
                <FormField label="Fournisseur" hint="optionnel" value={form.fournisseur}
                  onChange={(e) => h("fournisseur", e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-green-400 disabled:opacity-40
                           text-green-950 font-medium rounded-xl text-sm">
                {loading ? "Création…" : "Créer l'article"}
              </button>
            </form>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.id}>
                  <div className={`flex items-center justify-between rounded-xl px-4 py-3
                                  border ${item.enAlerte
                                    ? "bg-amber-400/[0.05] border-amber-400/20"
                                    : "bg-white/[0.03] border-white/8"}`}>
                    <div>
                      <p className="text-sm text-white/85">{item.nom}</p>
                      <p className="text-xs text-white/35">
                        {item.categorie} {item.fournisseur && `· ${item.fournisseur}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        item.enAlerte ? "text-amber-400" : "text-white/70"}`}>
                        {item.quantiteActuelle} {item.unite ?? ""}
                      </span>
                      <button onClick={() => setMvtItem(mvtItem === item.id ? null : item.id)}
                        className="text-[11px] px-2.5 py-1 bg-blue-400/10 hover:bg-blue-400/20
                                   text-blue-300 rounded-lg transition-colors">
                        Mouvement
                      </button>
                    </div>
                  </div>

                  {mvtItem === item.id && (
                    <form onSubmit={handleMouvement}
                      className="bg-blue-400/[0.04] border border-blue-400/15 rounded-xl
                                 px-4 py-4 mt-1 flex flex-col gap-3">
                      <div className="grid grid-cols-3 gap-3">
                        <FormField label="Date" type="date" value={mvt.date}
                          onChange={(e) => hm("date", e.target.value)} />
                        <FormField as="select" label="Type"
                          options={[
                            { value: "ENTREE", label: "Entrée (+)" },
                            { value: "SORTIE", label: "Sortie (-)" },
                          ]} value={mvt.type} onChange={(e) => hm("type", e.target.value)} />
                        <FormField label="Quantité" type="number" value={mvt.quantite}
                          onChange={(e) => hm("quantite", e.target.value)} />
                      </div>
                      <FormField label="Motif" hint="optionnel" value={mvt.motif}
                        onChange={(e) => hm("motif", e.target.value)} />
                      <div className="flex gap-2">
                        <button type="submit" disabled={loading}
                          className="flex-1 py-2 bg-blue-400/90 hover:bg-blue-400
                                     disabled:opacity-40 text-blue-950 font-medium
                                     rounded-lg text-xs">
                          {loading ? "..." : "Confirmer"}
                        </button>
                        <button type="button" onClick={() => setMvtItem(null)}
                          className="px-4 py-2 border border-white/10 text-white/40
                                     hover:text-white/60 rounded-lg text-xs">
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-center text-white/30 text-sm py-10">
                  Aucun article en stock. Ajoutez médicaments, matériel, consommables...
                </p>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}