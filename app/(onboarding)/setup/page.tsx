import { OnboardingShell } from "@/components/onboarding/OnboardingShell"

export const metadata = {
  title: "Configuration — AviSaaS",
}

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex items-center
                     justify-center px-4 py-16">
      {/* Glow décoratif */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2
                      w-96 h-96 bg-green-400/5 rounded-full blur-3xl
                      pointer-events-none" />
      <div className="relative w-full max-w-md">
        <OnboardingShell />
      </div>
    </main>
  )
}