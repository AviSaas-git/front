type ProgressBarProps = {
  currentStep: number  // 1 ou 2
  totalSteps:  number  // 2
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      {/* Barres */}
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isDone   = i + 1 < currentStep
          const isActive = i + 1 === currentStep
          return (
            <div
              key={i}
              className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                isDone   ? "bg-green-400" :
                isActive ? "bg-green-400/40" :
                           "bg-white/8"
              }`}
            />
          )
        })}
      </div>
      {/* Label */}
      <p className="text-xs text-white/30">
        Étape <span className="text-white/60 font-medium">{currentStep}</span> sur{" "}
        <span className="text-white/60 font-medium">{totalSteps}</span>
      </p>
    </div>
  )
}