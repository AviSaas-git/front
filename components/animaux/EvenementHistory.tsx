import type { EvenementEntry } from "@/lib/api/animaux"

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  PESEE:       { label: "⚖ Pesée",       color: "text-green-300" },
  PROPHYLAXIE: { label: "💉 Prophylaxie", color: "text-blue-300"  },
  MALADIE:     { label: "🤒 Maladie",     color: "text-amber-300" },
  MORT:        { label: "💀 Décès",       color: "text-rose-300"  },
  VENTE:       { label: "🏷 Vente",       color: "text-violet-300"},
  AUTRE:       { label: "📝 Autre",       color: "text-white/50"  },
}

export function EvenementHistory({ evenements }: { evenements: EvenementEntry[] }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Historique</h2>
      <p className="text-xs text-white/40 mb-4">
        {evenements.length} événement{evenements.length > 1 ? "s" : ""}
      </p>

      {evenements.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6">
          Aucun événement enregistré.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {evenements.map((ev) => {
            const t = TYPE_STYLES[ev.type] ?? { label: ev.type, color: "text-white/50" }
            return (
              <div key={ev.id}
                className="px-3 py-2.5 bg-white/[0.02] rounded-lg
                           border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-medium ${t.color}`}>{t.label}</span>
                  <span className="text-[10px] text-white/30">
                    {new Date(ev.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {ev.poidsKg && (
                  <p className="text-xs text-white/60">{ev.poidsKg} kg</p>
                )}
                {ev.traitement && (
                  <p className="text-xs text-white/60">
                    {ev.traitement}
                    {ev.dosage && ` — ${ev.dosage}`}
                    {ev.laboratoire && ` (${ev.laboratoire})`}
                  </p>
                )}
                {ev.cause && (
                  <p className="text-xs text-white/50">{ev.cause}</p>
                )}
                {ev.observations && (
                  <p className="text-[10px] text-white/30 mt-0.5">{ev.observations}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}