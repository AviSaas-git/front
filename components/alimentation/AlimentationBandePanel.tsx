"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FormField } from "@/components/ui/FormField"
import { fetchAlimentation, createConsommation, fetchFormulas } from "@/lib/api/alimentation"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"
type Props = { bandeId: string; effectifInitial: number }
const today = new Date().toISOString().split("T")[0]

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

export function AlimentationBandePanel({ bandeId, effectifInitial }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ date: today, formulaId: "", quantiteKg: "", observations: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState(false)

  const { data: alimentation, isLoading } = useQuery({
    queryKey: ["alimentation", bandeId],
    queryFn:  () => fetchAlimentation(bandeId),
  })

  const { data: formulas = [] } = useQuery({
    queryKey: ["formulas"], queryFn: fetchFormulas,
  })

  function h(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!form.formulaId)   { setError("Sélectionnez une formule"); return }
    if (!form.quantiteKg)  { setError("Quantité invalide"); return }

    setLoading(true)
    try {
     const res = await createConsommation(bandeId, {
        date: form.date, formulaId: form.formulaId,
        quantiteKg: Number(form.quantiteKg),
        observations: form.observations || undefined,
      })
      qc.invalidateQueries({ queryKey: ["alimentation", bandeId] })
      qc.invalidateQueries({ queryKey: ["finances", bandeId] })
      setForm({ date: today, formulaId: "", quantiteKg: "", observations: "" })
      toastSuccess(
          `Distribution enregistrée — ${form.quantiteKg} kg · Coût : ${fcfa(res.coutTotal)}`
        )
      setSuccess(true); setTimeout(() => setSuccess(false), 2500)
    } catch (err: any) {
  toastError(traduireErreur(err))}
    finally { setLoading(false) }
  }

  const selectedFormula = formulas.find((f) => f.id === form.formulaId)
  const coutPreview = selectedFormula && form.quantiteKg
    ? selectedFormula.prixRevientKg * Number(form.quantiteKg) : null

  if (isLoading) return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* KPIs */}
      {alimentation && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: "Total aliment",     value: `${alimentation.totalKgConsommes.toFixed(0)} kg`, color: "text-white" },
            { label: "Coût alimentation", value: fcfa(alimentation.coutTotalAlimentation), color: "text-green-400" },
            { label: "Kg / oiseau",       value: `${alimentation.consommationParOiseauKg.toFixed(2)} kg`, color: "text-white" },
            { label: "Formules utilisées",value: Object.keys(alimentation.coutParFormule).length.toString(), color: "text-white" },
          ].map((k) => (
            <div key={k.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] text-white/40 mb-1.5">{k.label}</p>
              <p className={`text-lg font-medium ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Formulaire saisie */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-1">Saisir une distribution</h2>
          <p className="text-xs text-white/40 mb-4">
            Le coût est calculé automatiquement depuis la formule.
          </p>

          {success && (
            <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                            px-3 py-2 text-xs text-green-300 mb-3">
              ✓ Distribution enregistrée
            </div>
          )}

          {formulas.length === 0 ? (
            <div className="bg-amber-400/[0.06] border border-amber-400/15 rounded-xl
                            px-4 py-3 text-xs text-amber-300">
              Aucune formule disponible.{" "}
              <a href="/alimentation/formulas"
                className="underline hover:text-amber-200">
                Créer une formule →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FormField label="Date" type="date" value={form.date}
                onChange={(e) => h("date", e.target.value)} />
              <FormField as="select" label="Formule d'aliment"
                options={[
                  { value: "", label: "Sélectionner…" },
                  ...formulas.map((f) => ({
                    value: f.id,
                    label: `${f.nom} — ${fcfa(f.prixRevientKg)}/kg`,
                  })),
                ]}
                value={form.formulaId}
                onChange={(e) => h("formulaId", e.target.value)} />
              <FormField label="Quantité distribuée (kg)" type="number" placeholder="Ex : 120"
                value={form.quantiteKg}
                onChange={(e) => h("quantiteKg", e.target.value)} />

              {coutPreview && (
                <p className="text-[11px] text-white/35">
                  Coût estimé :{" "}
                  <span className="text-green-400 font-medium">{fcfa(coutPreview)}</span>
                  {" · "}
                  {fcfa(coutPreview / effectifInitial)} / oiseau
                </p>
              )}

              <FormField label="Observations" hint="optionnel" value={form.observations}
                onChange={(e) => h("observations", e.target.value)} />
              {error && <p className="text-xs text-red-400">⚠ {error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                           text-green-950 font-medium rounded-xl text-sm mt-1">
                {loading ? "Enregistrement…" : "Enregistrer la distribution"}
              </button>
            </form>
          )}
        </div>

        {/* Historique */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-1">Historique distributions</h2>
          <p className="text-xs text-white/40 mb-4">
            {alimentation?.historique.length ?? 0} entrée{(alimentation?.historique.length ?? 0) > 1 ? "s" : ""}
          </p>
          {alimentation?.historique.length === 0 ? (
            <p className="text-xs text-white/25 text-center py-6">Aucune distribution encore.</p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
              {alimentation?.historique.map((c) => (
                <div key={c.id}
                  className="flex items-center justify-between px-3 py-2
                             bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div>
                    <p className="text-xs text-white/75">{c.formulaNom}</p>
                    <p className="text-[10px] text-white/30">
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                      {" · "}{c.quantiteKg} kg
                    </p>
                  </div>
                  <p className="text-xs font-medium text-white/70">
                    {fcfa(c.coutTotal)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}