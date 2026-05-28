"use client"

import { useEffect, useState } from "react"
import { StepFerme }    from "./StepFerme"
import { StepBatiment } from "./StepBatiment"
import type { FermeFormData } from "@/lib/types/forms"
import { useAuthStore } from "@/lib/store/auth"

// Les étapes disponibles
type Step = "ferme" | "batiment"

export function OnboardingShell() {
  const [step, setStep]           = useState<Step>("ferme")
  const [fermeId, setFermeId]     = useState<string | null>(null)
  const [fermeName, setFermeName] = useState<string>("")

    // ← Recharge le user depuis localStorage au montage
   const hydrate = useAuthStore((s) => s.hydrate)
   useEffect(() => { hydrate() }, [hydrate])

  function handleFermeDone(id: string, nom: string) {
    setFermeId(id)
    setFermeName(nom)
    setStep("batiment")
  }

  return (
    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-white font-medium text-lg">AviSaaS</span>
      </div>

      {/* Étapes */}
      {step === "ferme" && (
        <StepFerme onDone={handleFermeDone} />
      )}

      {step === "batiment" && fermeId && (
        <StepBatiment
          fermeId={fermeId}
          fermeName={fermeName}
          onBack={() => setStep("ferme")}
        />
      )}
    </div>
  )
}