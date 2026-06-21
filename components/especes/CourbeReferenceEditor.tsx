"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchCourbeReference, saveCourbeReference } from "@/lib/api/pesees"

type Props = { especeId: string }
type Ligne = { jour: string; poids: string }

export function CourbeReferenceEditor({ especeId }: Props) {
  const router = useRouter()
  const [lignes, setLignes] = useState<Ligne[]>([{ jour: "", poids: "" }])
  const [loading, setLoading]   = useState(false)
  const [chargement, setChargement] = useState(true)
  const [success, setSuccess]   = useState(false)

  // Charge la courbe existante si déjà saisie
  useEffect(() => {
    fetchCourbeReference(especeId).then((points) => {
      if (points.length > 0) {
        setLignes(points.map((p) => ({
          jour: String(p.jour),
          poids: String(p.poidsCibleGrammes ?? ""),
        })))
      }
      setChargement(false)
    })
  }, [especeId])

  function updateLigne(index: number, field: keyof Ligne, value: string) {
    setLignes((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function ajouterLigne() {
    setLignes((prev) => [...prev, { jour: "", poids: "" }])
  }

  function supprimerLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    const points = lignes
      .filter((l) => l.jour !== "" && l.poids !== "")
      .map((l) => ({
        jour: Number(l.jour),
        poidsGrammesCible: Number(l.poids),
      }))
      .sort((a, b) => a.jour - b.jour)

    if (points.length === 0) return

    setLoading(true)
    try {
      await saveCourbeReference(especeId, points)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } finally {
      setLoading(false)
    }
  }

  if (chargement) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <p className="text-white/30 text-sm">Chargement…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-12 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-medium">AviSaaS</span>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h1 className="text-lg font-medium text-white mb-1.5">
            Courbe de référence
          </h1>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            Transcrivez la fiche de croissance de votre fournisseur
            (jour → poids cible en grammes). Une seule saisie suffit.
          </p>

          {success && (
            <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                            px-3 py-2 text-xs text-green-300 mb-4">
              ✓ Courbe enregistrée — {lignes.length} points
            </div>
          )}

          <div className="flex gap-2 mb-2 px-1">
            <span className="text-[10px] text-white/30 flex-1">Jour</span>
            <span className="text-[10px] text-white/30 flex-1">Poids cible (g)</span>
            <span className="w-6" />
          </div>

          <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto mb-4">
            {lignes.map((ligne, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="number"
                  placeholder="Ex : 7"
                  value={ligne.jour}
                  onChange={(e) => updateLigne(i, "jour", e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10
                             rounded-lg text-sm text-white outline-none
                             focus:border-green-400/40"
                />
                <input
                  type="number"
                  placeholder="Ex : 180"
                  value={ligne.poids}
                  onChange={(e) => updateLigne(i, "poids", e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10
                             rounded-lg text-sm text-white outline-none
                             focus:border-green-400/40"
                />
                <button
                  type="button"
                  onClick={() => supprimerLigne(i)}
                  className="w-6 text-white/30 hover:text-red-400
                             transition-colors flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={ajouterLigne}
            className="w-full py-2 mb-4 border border-dashed border-white/15
                       text-white/40 hover:text-white/60 hover:border-white/25
                       rounded-lg text-xs transition-colors"
          >
            + Ajouter un jour
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2.5 bg-green-400 hover:bg-green-300
                       disabled:opacity-40 text-green-950 font-medium
                       rounded-xl text-sm transition-colors mb-2"
          >
            {loading ? "Enregistrement…" : "Enregistrer la courbe →"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-2.5 bg-transparent border border-white/10
                       text-white/40 hover:text-white/60 rounded-xl text-sm"
          >
            ← Retour
          </button>
        </div>
      </div>
    </main>
  )
}