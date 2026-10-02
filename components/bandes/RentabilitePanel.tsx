"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchRentabilite } from "@/lib/api/bandes"

type Props = { bandeId: string }

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

export function RentabilitePanel({ bandeId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["rentabilite", bandeId],
    queryFn:  () => fetchRentabilite(bandeId),
  })

  if (isLoading || !data) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const margeColor = data.margeNette >= 0 ? "text-green-400" : "text-rose-400"

  return (
    <div className="flex flex-col gap-4">

      {/* Verdict principal */}
      <div className={`border rounded-xl px-5 py-4 flex items-center justify-between
                       ${data.estRentable
                         ? "bg-green-400/[0.06] border-green-400/20"
                         : "bg-rose-400/[0.06] border-rose-400/20"}`}>
        <div>
          <p className="text-xs text-white/50 mb-1">Rentabilité globale</p>
          <p className={`text-2xl font-medium ${margeColor}`}>
            {data.margeNette >= 0 ? "+" : ""}{fcfa(data.margeNette)}
          </p>
          <p className="text-[11px] text-white/40 mt-1">
            {fcfa(data.margeParAnimal)} / animal · {data.tauxMarge.toFixed(1)}% de marge
          </p>
        </div>
        <p className="text-3xl">
          {data.estRentable ? "✅" : "❌"}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { l: "Recettes totales",    v: fcfa(data.recettesTotales),    c: "text-green-400" },
          { l: "Charges totales",     v: fcfa(data.chargesTotales),     c: "text-rose-400" },
          { l: "Coût / animal",       v: fcfa(data.coutProductionParAnimal), c: "text-white" },
          { l: "Seuil rentabilité",   v: `${Math.ceil(data.seuilRentabilite)} animaux`, c: "text-amber-400" },
        ].map(k => (
          <div key={k.l} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-white/40 mb-1.5">{k.l}</p>
            <p className={`text-lg font-medium ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      {/* Recettes vs Charges */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white mb-4">Recettes vs Charges</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] text-white/40 mb-2">RECETTES</p>
            {[
              { l: "Ventes animaux", v: data.recettesVentesAnimaux },
              { l: "Ventes œufs",    v: data.recettesVentesOeufs },
            ].map(r => (
              <div key={r.l} className="flex justify-between py-1.5 border-b border-white/[0.05]">
                <span className="text-xs text-white/60">{r.l}</span>
                <span className="text-xs font-medium text-green-400">{fcfa(r.v)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-xs text-white font-medium">Total</span>
              <span className="text-xs font-medium text-green-400">
                {fcfa(data.recettesTotales)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-white/40 mb-2">CHARGES</p>
            {[
              { l: "Production", v: data.chargesProduction },
              { l: "Fixes",      v: data.chargesFixes },
            ].map(r => (
              <div key={r.l} className="flex justify-between py-1.5 border-b border-white/[0.05]">
                <span className="text-xs text-white/60">{r.l}</span>
                <span className="text-xs font-medium text-rose-400">{fcfa(r.v)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-xs text-white font-medium">Total</span>
              <span className="text-xs font-medium text-rose-400">
                {fcfa(data.chargesTotales)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition charges */}
      {Object.keys(data.chargesParCategorie).length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">Détail des charges</h2>
          {Object.entries(data.chargesParCategorie)
            .sort(([,a],[,b]) => b - a)
            .map(([cat, montant]) => {
              const pct = data.chargesTotales > 0
                ? (montant / data.chargesTotales * 100) : 0
              return (
                <div key={cat} className="mb-2.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/70">{cat}</span>
                    <span className="text-xs text-white/50">
                      {fcfa(montant)} — {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400/70 rounded-full"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* Historique ventes */}
      {data.ventesAnimaux.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            Ventes d'animaux — {data.ventesAnimaux.length} transaction{data.ventesAnimaux.length > 1 ? "s" : ""}
          </h2>
          <div className="flex flex-col gap-1.5">
            {data.ventesAnimaux.map(v => (
              <div key={v.id}
                className="flex items-center justify-between px-3 py-2
                           bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div>
                  <p className="text-xs text-white/80">
                    {new Date(v.date).toLocaleDateString("fr-FR")}
                    {v.acheteur && <span className="text-white/40 ml-2">· {v.acheteur}</span>}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {v.nombreAnimaux} animaux × {v.poidsMoyenKg} kg × {fcfa(v.prixParKg)}/kg
                  </p>
                </div>
                <p className="text-xs font-medium text-green-400">{fcfa(v.montantTotal)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}