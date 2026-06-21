import type { MortaliteEntry } from "@/lib/api/bandes"

export function MortaliteHistory({ mortalites }: { mortalites: MortaliteEntry[] }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Historique</h2>
      <p className="text-xs text-white/40 mb-4">
        {mortalites.length} saisie{mortalites.length > 1 ? "s" : ""}
      </p>
      {mortalites.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6">Aucune mortalité encore.</p>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {mortalites.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-3 py-2
                                       bg-white/[0.02] rounded-lg border border-white/[0.05]">
              <div>
                <p className="text-xs text-white/70">
                  {new Date(m.date).toLocaleDateString("fr-FR")}
                </p>
                {m.cause && <p className="text-[10px] text-white/30">{m.cause}</p>}
              </div>
              <span className="text-xs font-medium text-rose-400">-{m.nombreMorts}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}