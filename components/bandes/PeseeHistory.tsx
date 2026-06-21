import type { PeseeEntry } from "@/lib/api/pesees"

export function PeseeHistory({ pesees }: { pesees: PeseeEntry[] }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Historique des pesées</h2>
      <p className="text-xs text-white/40 mb-4">
        {pesees.length} pesée{pesees.length > 1 ? "s" : ""} enregistrée{pesees.length > 1 ? "s" : ""}
      </p>

      {pesees.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6">Aucune pesée encore.</p>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {pesees.map((p) => {
            const ecartColor =
              p.ecartPct === null ? "text-white/30"
              : p.ecartPct < -5 ? "text-amber-400"
              : p.ecartPct > 5  ? "text-blue-300"
              : "text-green-400"

            return (
              <div key={p.id} className="flex items-center justify-between px-3 py-2
                                         bg-white/[0.02] rounded-lg border border-white/[0.05]">
                <div>
                  <p className="text-xs text-white/70">
                    J{p.ageEnJours} · {new Date(p.date).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {p.nombreSujetsPeses} sujets pesés
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">
                    {Math.round(p.poidsMoyenGrammes)} g
                  </p>
                  {p.ecartPct !== null && (
                    <p className={`text-[10px] ${ecartColor}`}>
                      {p.ecartPct > 0 ? "+" : ""}{p.ecartPct.toFixed(1)}% vs cible
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}