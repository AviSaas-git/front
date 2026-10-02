"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchSalles, createSalle, changerStatutSalle, deleteSalle
} from "@/lib/api/batiments"
import { FormField } from "@/components/ui/FormField"
import { DeleteButton } from "@/components/ui/DeleteButton"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

const STATUT_STYLES: Record<string, { label: string; className: string }> = {
  LIBRE:        { label: "Disponible",  className: "bg-green-400/10 text-green-300" },
  OCCUPE:       { label: "Occupée",     className: "bg-blue-400/10 text-blue-300" },
  NETTOYAGE:    { label: "Nettoyage",   className: "bg-amber-400/10 text-amber-300" },
  MAINTENANCE:  { label: "Maintenance", className: "bg-orange-400/10 text-orange-300" },
  HORS_SERVICE: { label: "Hors service",className: "bg-rose-400/10 text-rose-300" },
}

const STATUT_OPTIONS = Object.entries(STATUT_STYLES).map(([value, { label }]) => ({
  value, label,
}))

type Props = { batimentId: string; batimentNom: string }

export function BatimentDetailPanel({ batimentId, batimentNom }: Props) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: "", capacite: "", surfaceM2: "" })
  const [loading, setLoading] = useState(false)

  const { data: salles = [], isLoading } = useQuery({
    queryKey: ["salles", batimentId],
    queryFn:  () => fetchSalles(batimentId),
  })

  function h(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nom || !form.capacite) { toastError("Nom et capacité requis"); return }
    setLoading(true)
    try {
      await createSalle(batimentId, {
        nom: form.nom,
        capacite: Number(form.capacite),
        surfaceM2: form.surfaceM2 ? Number(form.surfaceM2) : undefined,
      })
      qc.invalidateQueries({ queryKey: ["salles", batimentId] })
      toastSuccess(`Salle "${form.nom}" ajoutée.`)
      setForm({ nom: "", capacite: "", surfaceM2: "" })
      setShowForm(false)
    } catch (err: any) { toastError(traduireErreur(err)) }
    finally { setLoading(false) }
  }

  async function handleStatut(salleId: string, statut: string) {
    try {
      await changerStatutSalle(batimentId, salleId, { statut })
      qc.invalidateQueries({ queryKey: ["salles", batimentId] })
      toastSuccess("Statut mis à jour.")
    } catch (err: any) { toastError(traduireErreur(err)) }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-white">{batimentNom} — Salles</h2>
          <p className="text-xs text-white/40">
            {salles.length} salle{salles.length > 1 ? "s" : ""}
            {" · "}
            {salles.filter(s => s.statut === "LIBRE").length} disponible{salles.filter(s => s.statut === "LIBRE").length > 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="px-3 py-1.5 bg-green-400/10 hover:bg-green-400/20
                     text-green-300 rounded-lg text-xs transition-colors">
          {showForm ? "Annuler" : "+ Ajouter une salle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate}
          className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4
                     flex flex-col gap-3 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Nom" placeholder="Ex : Salle A" value={form.nom}
              onChange={e => h("nom", e.target.value)} />
            <FormField label="Capacité" type="number" placeholder="Ex : 500"
              value={form.capacite} onChange={e => h("capacite", e.target.value)} />
            <FormField label="Surface (m²)" type="number" hint="optionnel"
              value={form.surfaceM2} onChange={e => h("surfaceM2", e.target.value)} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-green-400 text-green-950 font-medium
                       rounded-lg text-xs disabled:opacity-40">
            {loading ? "Création…" : "Créer la salle"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : salles.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6">
          Ce bâtiment n'a pas encore de salles définies.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {salles.map(salle => {
            const style = STATUT_STYLES[salle.statut] ?? STATUT_STYLES.LIBRE
            return (
              <div key={salle.id}
                className="flex items-center justify-between px-3 py-2.5
                           bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <div>
                  <p className="text-sm text-white/85">{salle.nom}</p>
                  <p className="text-[10px] text-white/35">
                    {salle.capacite} places
                    {salle.surfaceM2 && ` · ${salle.surfaceM2} m²`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={salle.statut}
                    onChange={e => handleStatut(salle.id, e.target.value)}
                    className="text-[11px] px-2 py-1 bg-white/5 border border-white/10
                               rounded-lg text-white/70 outline-none cursor-pointer"
                  >
                    {STATUT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>

                  <span className={`text-[10px] font-medium px-2 py-0.5
                                   rounded-full ${style.className}`}>
                    {style.label}
                  </span>

                  <DeleteButton
                    label="✕"
                    confirmMsg="Supprimer cette salle ?"
                    successMsg={`Salle "${salle.nom}" supprimée.`}
                    onDelete={() => deleteSalle(batimentId, salle.id)}
                    onSuccess={() => qc.invalidateQueries({ queryKey: ["salles", batimentId] })}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}