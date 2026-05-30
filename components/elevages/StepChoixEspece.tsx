"use client"

import { useState } from "react"
import { EspeceCard } from "./EspeceCard"
import type { EspeceConfig } from "@/lib/types/elevage"
import { useQuery } from "@tanstack/react-query"
import { fetchEspeces } from "@/lib/api/bandes"

type Props = {
  onDone: (espece: EspeceConfig) => void
  onCancel: () => void
}

export function StepChoixEspece({ onDone, onCancel }: Props) {
  const [selected, setSelected] = useState<EspeceConfig | null>(null)

  // 💡 TanStack Query récupère les vraies espèces (avec les UUIDs) depuis ton API Spring Boot
  const { data: especes = [], isLoading } = useQuery({
    queryKey: ["especes"],
    queryFn: fetchEspeces,
    staleTime: Infinity, // l'ID et la configuration des espèces ne changent pas en cours de session
  })

  

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">

      {/* Barre de progression */}
      <div className="flex gap-1.5 mb-4">
        <div className="flex-1 h-px bg-green-400 rounded-full" />
        <div className="flex-1 h-px bg-white/8 rounded-full" />
      </div>
      <p className="text-[11px] text-white/30 mb-5">
        Étape <span className="text-white/60 font-medium">1</span> sur{" "}
        <span className="text-white/60 font-medium">2</span>
      </p>

      <h1 className="text-lg font-medium text-white mb-1.5">
        Choisir l&apos;espèce
      </h1>
      <p className="text-sm text-white/40 leading-relaxed mb-5">
        L&apos;espèce détermine le mode de gestion et le formulaire suivant.
      </p>

      {/* Écran de chargement optionnel pendant que l'API répond */}
      {isLoading ? (
        <div className="text-center text-xs text-white/40 my-10 py-4 animate-pulse">
          Chargement des espèces depuis AviSaaS...
        </div>
      ) : (
        /* Grille espèces chargées dynamiquement */
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {especes.map((esp) => (
            <EspeceCard
              key={esp.id} // C'est maintenant le vrai UUID de la BDD !
              espece={esp}
              selected={selected?.id === esp.id}
              onClick={() => setSelected(esp)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onDone(selected)}
        className="w-full py-2.5 bg-green-400 hover:bg-green-300
                   disabled:opacity-30 disabled:cursor-not-allowed
                   text-green-950 font-medium rounded-xl text-sm
                   transition-colors"
      >
        {selected
          ? `Continuer avec ${selected.nom} →`
          : "Sélectionnez une espèce"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full py-2.5 mt-2.5 bg-transparent
                   border border-white/10 text-white/40
                   hover:text-white/60 rounded-xl text-sm
                   transition-colors"
      >
        Annuler
      </button>
    </div>
  )
}