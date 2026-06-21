import type { ProphylaxieEntry } from "@/lib/api/bandes"

const VOIE_LABELS: Record<string, string> = {
  EAU_DE_BOISSON: "Eau de boisson", INJECTION: "Injection",
  SPRAY: "Spray", ALIMENT: "Aliment", OCULAIRE_NASALE: "Oculaire/nasale",
}

export function ProphylaxieHistory({ entries }: { entries: ProphylaxieEntry[] }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Carnet sanitaire</h2>
      <p className="text-xs text-white/40 mb-4">
        {entries.length} traitement{entries.length > 1 ? "s" : ""} sur la période
      </p>
      {entries.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6">Aucun traitement encore.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Jour","Date","Traitement","Labo","Dosage","Voie"].map((h) => (
                  <th key={h} className="text-left px-2 py-2 text-[10px] font-medium
                                         text-white/30 border-b border-white/[0.06]
                                         whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-2 py-2 text-xs font-mono text-green-400 whitespace-nowrap">
                    J+{e.ageEnJoursAuTraitement}
                  </td>
                  <td className="px-2 py-2 text-xs text-white/50 whitespace-nowrap">
                    {new Date(e.dateApplication).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-2 py-2 text-xs text-white/80">{e.traitement}</td>
                  <td className="px-2 py-2 text-xs text-white/40">{e.laboratoire ?? "—"}</td>
                  <td className="px-2 py-2 text-xs text-white/50">{e.dosage}</td>
                  <td className="px-2 py-2 text-[10px] text-white/30 whitespace-nowrap">
                    {e.voieAdministration ? VOIE_LABELS[e.voieAdministration] : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}