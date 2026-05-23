"use client"

import { useState }          from "react"
import { StepChoixEspece }   from "./StepChoixEspece"
import { StepFormBande }     from "./StepFormBande"
import { StepFormAnimal }    from "./StepFormAnimal"
import type { EspeceConfig, ElevageStep } from "@/lib/types/elevage"

type Props = { onCancel: () => void }

export function NouvelElevageShell({ onCancel }: Props) {
  const [step, setStep]     = useState<ElevageStep>("espece")
  const [espece, setEspece] = useState<EspeceConfig | null>(null)

  function handleEspeceChoisie(esp: EspeceConfig) {
    setEspece(esp)
    setStep("formulaire")
  }

  if (step === "espece") {
    return (
      <StepChoixEspece
        onDone={handleEspeceChoisie}
        onCancel={onCancel}
      />
    )
  }

  // Étape 2 — le bon formulaire selon le mode
  if (!espece) return null

  return espece.modeGestion === "LOT" ? (
    <StepFormBande
      espece={espece}
      onBack={() => setStep("espece")}
    />
  ) : (
    <StepFormAnimal
      espece={espece}
      onBack={() => setStep("espece")}
    />
  )
}