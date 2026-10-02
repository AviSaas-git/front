"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sidebar }      from "@/components/dashboard/Sidebar"
import { Topbar }       from "@/components/dashboard/Topbar"
import { FormField }    from "@/components/ui/FormField"
import { DeleteButton } from "@/components/ui/DeleteButton"
import { useAuthStore } from "@/lib/store/auth"
import {
  fetchBatimentDetail, updateBatiment, changerStatutBatiment,
  createSalle, changerStatutSalle, deleteSalle
} from "@/lib/api/batiments"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

type Props = { batimentId: string }

const STATUTS_BAT = [
  { value: "LIBRE",        label: "🟢 Disponible" },
  { value: "OCCUPE",       label: "🔵 Occupé" },
  { value: "NETTOYAGE",    label: "🟡 Nettoyage" },
  { value: "MAINTENANCE",  label: "🟠 Maintenance" },
  { value: "HORS_SERVICE", label: "🔴 Hors service" },
]

const STATUTS_SALLE = [
  { value: "LIBRE",        label: "Disponible" },
  { value: "OCCUPE",       label: "Occupée" },
  { value: "NETTOYAGE",    label: "Nettoyage" },
  { value: "MAINTENANCE",  label: "Maintenance" },
  { value: "HORS_SERVICE", label: "Hors service" },
]

const COULEURS: Record<string, string> = {
  LIBRE:        "text-green-300 bg-green-400/10",
  OCCUPE:       "text-blue-300 bg-blue-400/10",
  NETTOYAGE:    "text-amber-300 bg-amber-400/10",
  MAINTENANCE:  "text-orange-300 bg-orange-400/10",
  HORS_SERVICE: "text-rose-300 bg-rose-400/10",
}

export function BatimentDetailPage({ batimentId }: Props) {
  const router  = useRouter()
  const qc      = useQueryClient()
  const hydrate = useAuthStore((s) => s.hydrate)
  const token   = useAuthStore((s) => s.token)
  const [ready, setReady]         = useState(false)
  const [editBat, setEditBat]     = useState(false)
  const [showAddSalle, setShowAddSalle] = useState(false)
  const [loadingBat, setLoadingBat]    = useState(false)
  const [loadingSalle, setLoadingSalle] = useState(false)

  const [formBat, setFormBat] = useState({
    nom: "", capacite: "", surfaceM2: "", typeChauffage: "", type: "",
  })
  const [formSalle, setFormSalle] = useState({
    nom: "", capacite: "", surfaceM2: "", observations: "",
  })

  useEffect(() => { hydrate(); setReady(true) }, [hydrate])

  const { data: bat, isLoading } = useQuery({
    queryKey: ["batiment", batimentId],
    queryFn:  () => fetchBatimentDetail(batimentId),
    enabled:  ready && !!token,
  })

  // ← Corrigé : useEffect remplace onSuccess (React Query v5)
  useEffect(() => {
    if (bat) {
      setFormBat({
        nom:          bat.nom,
        capacite:     String(bat.capacite),
        surfaceM2:    String(bat.surfaceM2 ?? ""),
        typeChauffage:bat.typeChauffage ?? "",
        type:         bat.type,
      })
    }
  }, [bat])

  function hb(f: string, v: string) { setFormBat(p => ({ ...p, [f]: v })) }
  function hs(f: string, v: string) { setFormSalle(p => ({ ...p, [f]: v })) }

  async function handleUpdateBat(e: React.FormEvent) {
    e.preventDefault(); setLoadingBat(true)
    try {
      await updateBatiment(batimentId, {
        nom:           formBat.nom || undefined,
        capacite:      formBat.capacite ? Number(formBat.capacite) : undefined,
        surfaceM2:     formBat.surfaceM2 ? Number(formBat.surfaceM2) : undefined,
        typeChauffage: formBat.typeChauffage || undefined,
        type:          formBat.type || undefined,
      })
      qc.invalidateQueries({ queryKey: ["batiment", batimentId] })
      qc.invalidateQueries({ queryKey: ["batiments"] })
      toastSuccess("Bâtiment mis à jour.")
      setEditBat(false)
    } catch (err: any) { toastError(traduireErreur(err)) }
    finally { setLoadingBat(false) }
  }

  async function handleStatutBat(statut: string) {
    try {
      await changerStatutBatiment(batimentId, { statut })
      qc.invalidateQueries({ queryKey: ["batiment", batimentId] })
      qc.invalidateQueries({ queryKey: ["batiments"] })
      toastSuccess(`Statut → ${STATUTS_BAT.find(s => s.value === statut)?.label}`)
    } catch (err: any) { toastError(traduireErreur(err)) }
  }

  async function handleAddSalle(e: React.FormEvent) {
    e.preventDefault()
    if (!formSalle.nom || !formSalle.capacite) {
      toastError("Nom et capacité requis"); return
    }
    setLoadingSalle(true)
    try {
      await createSalle(batimentId, {
        nom: formSalle.nom, capacite: Number(formSalle.capacite),
        surfaceM2: formSalle.surfaceM2 ? Number(formSalle.surfaceM2) : undefined,
        observations: formSalle.observations || undefined,
      })
      qc.invalidateQueries({ queryKey: ["batiment", batimentId] })
      toastSuccess(`Salle "${formSalle.nom}" créée.`)
      setFormSalle({ nom: "", capacite: "", surfaceM2: "", observations: "" })
      setShowAddSalle(false)
    } catch (err: any) { toastError(traduireErreur(err)) }
    finally { setLoadingSalle(false) }
  }

  async function handleStatutSalle(salleId: string, statut: string) {
    try {
      await changerStatutSalle(batimentId, salleId, { statut })
      qc.invalidateQueries({ queryKey: ["batiment", batimentId] })
      toastSuccess("Statut salle mis à jour.")
    } catch (err: any) { toastError(traduireErreur(err)) }
  }

  if (!ready || isLoading || !bat) {
    return (
      <div className="flex h-screen bg-[#09090b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/30 text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  const statutActuel = STATUTS_BAT.find(s => s.value === bat.modeOccupation)

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={`🏗 ${bat.nom}`} subtitle={`${bat.fermeNom} · ${bat.type}`} />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <button onClick={() => router.back()}
            className="text-xs text-white/40 hover:text-white/70 self-start
                       flex items-center gap-1 transition-colors">
            ← Retour
          </button>

          {/* ── INFORMATIONS ── */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Informations</h2>
              <button onClick={() => setEditBat(v => !v)}
                className="text-xs text-white/40 hover:text-white/70 px-2 py-1
                           rounded-lg hover:bg-white/5 transition-colors">
                {editBat ? "Annuler" : "✏ Modifier"}
              </button>
            </div>

            {editBat ? (
              <form onSubmit={handleUpdateBat} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nom" value={formBat.nom}
                    onChange={e => hb("nom", e.target.value)} />
                  <FormField label="Type" value={formBat.type}
                    onChange={e => hb("type", e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField label="Capacité" type="number" value={formBat.capacite}
                    onChange={e => hb("capacite", e.target.value)} />
                  <FormField label="Surface m²" type="number" hint="optionnel"
                    value={formBat.surfaceM2}
                    onChange={e => hb("surfaceM2", e.target.value)} />
                  <FormField label="Chauffage" hint="optionnel"
                    value={formBat.typeChauffage}
                    onChange={e => hb("typeChauffage", e.target.value)} />
                </div>
                <button type="submit" disabled={loadingBat}
                  className="w-full py-2.5 bg-green-400 disabled:opacity-40
                             text-green-950 font-medium rounded-xl text-sm">
                  {loadingBat ? "Mise à jour…" : "Enregistrer"}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { l: "Ferme",     v: bat.fermeNom },
                  { l: "Type",      v: bat.type },
                  { l: "Capacité",  v: `${bat.capacite.toLocaleString()} places` },
                  { l: "Surface",   v: bat.surfaceM2 ? `${bat.surfaceM2} m²` : "—" },
                  { l: "Chauffage", v: bat.typeChauffage ?? "—" },
                  { l: "Salles",    v: `${bat.nombreSalles}` },
                ].map(k => (
                  <div key={k.l}>
                    <p className="text-[10px] text-white/30 mb-0.5">{k.l}</p>
                    <p className="text-xs text-white/80">{k.v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── STATUT ── */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-medium text-white mb-4">Statut d'occupation</h2>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full
                               ${COULEURS[bat.modeOccupation] ?? COULEURS.LIBRE}`}>
                {statutActuel?.label ?? bat.modeOccupation}
              </span>
              {bat.noteStatut && (
                <p className="text-xs text-white/50 italic">{bat.noteStatut}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUTS_BAT.map(s => (
                <button key={s.value}
                  onClick={() => handleStatutBat(s.value)}
                  disabled={s.value === bat.modeOccupation}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/10
                             hover:bg-white/10 text-white/60 hover:text-white/80
                             disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors">
                  {s.label}
                </button>
              ))}
            </div>

            {bat.modeOccupation === "OCCUPE" && (
              <p className="mt-3 text-[11px] text-blue-300/80 bg-blue-400/[0.06]
                            px-3 py-2 rounded-lg">
                🔵 Bande active — créer une nouvelle bande ici est bloqué
                jusqu'à la clôture.
              </p>
            )}
            {bat.modeOccupation === "NETTOYAGE" && (
              <p className="mt-3 text-[11px] text-amber-300/80 bg-amber-400/[0.06]
                            px-3 py-2 rounded-lg">
                🧹 En nettoyage. Passez en "Disponible" quand le vide sanitaire
                est terminé.
              </p>
            )}
          </div>

          {/* ── SALLES ── */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-white">Salles</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {bat.salles.length} salle{bat.salles.length > 1 ? "s" : ""}
                  {bat.sallesDisponibles > 0
                    ? ` · ${bat.sallesDisponibles} disponible${bat.sallesDisponibles > 1 ? "s" : ""}`
                    : ""}
                </p>
              </div>
              <button onClick={() => setShowAddSalle(v => !v)}
                className="px-3 py-1.5 bg-green-400/10 hover:bg-green-400/20
                           text-green-300 rounded-lg text-xs transition-colors">
                {showAddSalle ? "Annuler" : "+ Ajouter une salle"}
              </button>
            </div>

            {showAddSalle && (
              <form onSubmit={handleAddSalle}
                className="bg-white/[0.02] border border-white/[0.07] rounded-xl
                           p-4 mb-4 flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  <FormField label="Nom" placeholder="Ex : Salle A"
                    value={formSalle.nom}
                    onChange={e => hs("nom", e.target.value)} />
                  <FormField label="Capacité" type="number"
                    placeholder="Ex : 250"
                    value={formSalle.capacite}
                    onChange={e => hs("capacite", e.target.value)} />
                  <FormField label="Surface m²" hint="optionnel" type="number"
                    value={formSalle.surfaceM2}
                    onChange={e => hs("surfaceM2", e.target.value)} />
                </div>
                <FormField label="Observations" hint="optionnel"
                  value={formSalle.observations}
                  onChange={e => hs("observations", e.target.value)} />
                <button type="submit" disabled={loadingSalle}
                  className="w-full py-2 bg-green-400 text-green-950
                             font-medium rounded-xl text-xs disabled:opacity-40">
                  {loadingSalle ? "Création…" : "Créer la salle"}
                </button>
              </form>
            )}

            {bat.salles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">Aucune salle définie.</p>
                <p className="text-white/20 text-xs mt-1">
                  Ajoutez des salles pour gérer l'occupation par zone.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {bat.salles.map(salle => (
                    <div key={salle.id}
                      className="flex items-center justify-between
                                 bg-white/[0.02] border border-white/[0.05]
                                 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          salle.statut === "LIBRE"    ? "bg-green-400" :
                          salle.statut === "OCCUPE"   ? "bg-blue-400"  :
                          salle.statut === "NETTOYAGE"? "bg-amber-400" :
                          "bg-rose-400"}`} />
                        <div>
                          <p className="text-sm text-white/85 font-medium">
                            {salle.nom}
                          </p>
                          <p className="text-[10px] text-white/35">
                            {salle.capacite} places
                            {salle.surfaceM2 && ` · ${salle.surfaceM2} m²`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select value={salle.statut}
                          onChange={e => handleStatutSalle(salle.id, e.target.value)}
                          className="text-[11px] px-2 py-1 bg-white/5 border
                                     border-white/10 rounded-lg text-white/70
                                     outline-none cursor-pointer">
                          {STATUTS_SALLE.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <span className={`text-[10px] font-medium px-2 py-0.5
                                         rounded-full ${COULEURS[salle.statut]
                                           ?? COULEURS.LIBRE}`}>
                          {STATUTS_SALLE.find(s => s.value === salle.statut)?.label}
                        </span>

                        <DeleteButton
                          label="✕"
                          confirmMsg={`Supprimer "${salle.nom}" ?`}
                          successMsg={`Salle "${salle.nom}" supprimée.`}
                          onDelete={() => deleteSalle(batimentId, salle.id)}
                          onSuccess={() =>
                            qc.invalidateQueries({ queryKey: ["batiment", batimentId] })}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t
                                border-white/[0.06]">
                  {[
                    { l: "Disponibles",  v: bat.salles.filter(s => s.statut === "LIBRE").length,      c: "text-green-400" },
                    { l: "Occupées",     v: bat.salles.filter(s => s.statut === "OCCUPE").length,     c: "text-blue-400" },
                    { l: "Nettoyage",    v: bat.salles.filter(s => s.statut === "NETTOYAGE"
                                              || s.statut === "MAINTENANCE").length,                   c: "text-amber-400" },
                  ].map(k => (
                    <div key={k.l} className="text-center">
                      <p className={`text-xl font-medium ${k.c}`}>{k.v}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{k.l}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}