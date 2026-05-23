import { LoginForm } from "@/components/auth/LoginForm"

export const metadata = {
  title: "Inscription — AviSaaS",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex items-center
                     justify-center px-4 py-16">
      {/* Glow décoratif */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2
                      w-96 h-96 bg-green-400/5 rounded-full blur-3xl
                      pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-white font-medium text-lg">AviSaaS</span>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}