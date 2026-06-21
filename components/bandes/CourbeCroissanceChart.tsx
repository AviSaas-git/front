"use client"

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts"
import type { CourbePoint } from "@/lib/api/pesees"

type Props = { data: CourbePoint[]; especeNom: string }

export function CourbeCroissanceChart({ data, especeNom }: Props) {
  const aDesDonnees = data.some((d) => d.poidsCibleGrammes !== null)

  if (!aDesDonnees) {
    return (
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6
                      flex flex-col items-center justify-center text-center
                      h-64">
        <p className="text-sm text-white/50 mb-1">
          Aucune courbe de référence configurée
        </p>
        <p className="text-xs text-white/30 mb-4">
          Saisissez la fiche de croissance {especeNom} pour comparer
        </p>
        <a href="#"
          className="text-xs text-green-400 hover:text-green-300 underline">
          Configurer la courbe de référence →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">
        Courbe de croissance
      </h2>
      <p className="text-xs text-white/40 mb-4">
        Poids réel vs poids cible {especeNom} (en grammes)
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="jour"
            tickFormatter={(j) => `J${j}`}
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
            tickFormatter={(v) => `${v}g`}
          />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(j) => `Jour ${j}`}
            formatter={(value, name) => [
                `${value ?? "-"} g`,
                String(name),
                ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
          />
          <Line
            type="monotone"
            dataKey="poidsCibleGrammes"
            name="Poids cible (fournisseur)"
            stroke="rgba(255,255,255,0.35)"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="poidsReelGrammes"
            name="Poids réel (ferme)"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ r: 3, fill: "#4ade80" }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}