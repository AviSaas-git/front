"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { fetchIngredients, fetchFormulas } from "@/lib/api/alimentation"

function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

export function AlimentationShell() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(!!localStorage.getItem("avisaas_token"))
  }, [])

  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredients"], queryFn: fetchIngredients, enabled: ready,
  })
  const { data: formulas = [] } = useQuery({
    queryKey: ["formulas"], queryFn: fetchFormulas, enabled: ready,
  })

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Alimentation" subtitle="Ingrédients, formules et consommations" />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* 2 cartes de navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Ingrédients */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5
                            hover:border-white/16 transition-colors cursor-pointer"
              onClick={() => router.push("/alimentation/ingredients")}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌾</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                 bg-green-400/10 text-green-300">
                  {ingredients.length} enregistrés
                </span>
              </div>
              <h2 className="text-sm font-medium text-white mb-1">Ingrédients</h2>
              <p className="text-xs text-white/40 mb-3">
                Maïs, tourteau de soja, CMV, son de blé... avec prix d'achat.
              </p>

              {ingredients.slice(0, 4).map((ing) => (
                <div key={ing.id}
                  className="flex items-center justify-between py-1.5
                             border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-white/70">{ing.nom}</span>
                  <span className="text-xs text-white/40">{fcfa(ing.prixUnitaireKg)} / kg</span>
                </div>
              ))}

              <button className="w-full mt-3 py-2 text-xs text-green-400
                                 hover:text-green-300 transition-colors text-center">
                Gérer les ingrédients →
              </button>
            </div>

            {/* Formules */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5
                            hover:border-white/16 transition-colors cursor-pointer"
              onClick={() => router.push("/alimentation/formulas")}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🧪</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                 bg-blue-400/10 text-blue-300">
                  {formulas.length} formule{formulas.length > 1 ? "s" : ""}
                </span>
              </div>
              <h2 className="text-sm font-medium text-white mb-1">Formules d'aliment</h2>
              <p className="text-xs text-white/40 mb-3">
                Démarrage, croissance, finition... avec prix de revient calculé.
              </p>

              {formulas.slice(0, 4).map((f) => (
                <div key={f.id}
                  className="flex items-center justify-between py-1.5
                             border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-white/70">{f.nom}</span>
                  <span className="text-xs text-white/40">
                    {fcfa(f.prixRevientKg)} / kg
                    {Math.abs(f.proportionTotale - 100) > 1 && (
                      <span className="text-amber-400 ml-1">⚠</span>
                    )}
                  </span>
                </div>
              ))}

              <button className="w-full mt-3 py-2 text-xs text-blue-400
                                 hover:text-blue-300 transition-colors text-center">
                Gérer les formules →
              </button>
            </div>
          </div>

          {/* Conseil si aucune donnée */}
          {ingredients.length === 0 && (
            <div className="bg-amber-400/[0.06] border border-amber-400/15
                            rounded-xl p-4 text-xs text-amber-300 leading-relaxed">
              <b>Pour commencer :</b> créez d'abord vos ingrédients (maïs, tourteau, CMV...),
              puis composez vos formules. Vous pourrez ensuite enregistrer les
              consommations depuis la page détail de chaque bande.
            </div>
          )}

        </main>
      </div>
    </div>
  )
}