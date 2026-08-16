"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteDepense, fetchFinances } from "@/lib/api/finances"
import { DepenseForm }   from "./DepenseForm"
import { DeleteButton } from "../ui/DeleteButton"

type Props = { bandeId: string; effectifInitial: number }

const CATEGORIE_COLORS: Record<string, string> = {
  "Alimentation":             "#4ade80",
  "Prophylaxie / vaccins":    "#60a5fa",
  "Chauffage":                "#fb923c",
  "Transport poussins":       "#a78bfa",
  "Amortissement bâtiment":   "#f472b6",
  "Électricité":              "#facc15",
  "Salaires":                 "#94a3b8",
}

function fcfa(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

export function FinancesDashboard({ bandeId, effectifInitial }: Props) {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["finances", bandeId],
    queryFn:  () => fetchFinances(bandeId),
  })

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["finances", bandeId] })
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const entries = Object.entries(data.parSousCategorie)
  const maxVal  = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex flex-col gap-4">

      {/* KPIs Finances */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: "Total dépenses",  value: fcfa(data.totalDepenses), color: "text-white" },
          { label: "Production",      value: fcfa(data.totalProduction), color: "text-green-400" },
          { label: "Charges fixes",   value: fcfa(data.totalChargeFixe), color: "text-amber-400" },
          { label: "Coût / oiseau",   value: fcfa(data.coutParOiseau),  color: "text-white" },
        ].map((k) => (
          <div key={k.label}
            className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-white/40 mb-1.5">{k.label}</p>
            <p className={`text-lg font-medium ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Répartition par sous-catégorie */}
      {entries.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">Répartition des dépenses</h2>
          <div className="flex flex-col gap-2.5">
            {entries.map(([cat, montant]) => {
              const pct = (montant / maxVal) * 100
              const total = data.totalDepenses
              const pctTotal = total > 0 ? (montant / total * 100) : 0
              const color = CATEGORIE_COLORS[cat] ?? "#6b7280"

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70">{cat}</span>
                    <span className="text-xs text-white/50">
                      {fcfa(montant)} — {pctTotal.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Formulaire + Historique côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DepenseForm bandeId={bandeId} onSuccess={invalidate} />

        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-1">Historique</h2>
          <p className="text-xs text-white/40 mb-4">
            {data.dernieresDepenses.length} opération{data.dernieresDepenses.length > 1 ? "s" : ""}
          </p>

          {data.dernieresDepenses.length === 0 ? (
            <p className="text-xs text-white/25 text-center py-6">
              Aucune dépense encore enregistrée.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
              {data.dernieresDepenses.map((d) => (
                <div key={d.id}
                  className="flex items-center justify-between px-3 py-2
                             bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div>
                    <p className="text-xs text-white/75">{d.sousCategorie}</p>
                    <p className="text-[10px] text-white/30">
                      {new Date(d.date).toLocaleDateString("fr-FR")}
                      {d.fournisseur && ` · ${d.fournisseur}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-white/80">{fcfa(d.montant)}</p>
                    <p className={`text-[10px] ${
                      d.categorie === "PRODUCTION"
                        ? "text-green-400/60" : "text-amber-400/60"}`}>
                      {d.categorie === "PRODUCTION" ? "Production" : "Charge fixe"}
                    </p>
                  </div>
                  <DeleteButton
                    confirmMsg="Supprimer cette dépense ?"
                    successMsg="Dépense supprimée."
                    onDelete={() => deleteDepense(bandeId, d.id)}
                    onSuccess={invalidate}
                  />
                </div>
                
              ))}
            </div>
            
          )}
        </div>
      </div>

    </div>
  )
}