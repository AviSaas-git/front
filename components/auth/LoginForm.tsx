"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormField } from "@/components/ui/FormField"
import type { LoginFormData } from "@/lib/types/forms"
import { login } from "@/lib/api/auth"
import { useAuthStore } from "@/lib/store/auth"

const INITIAL: LoginFormData = { email: "", password: "" }

export function LoginForm() {
  const router = useRouter()
  const [form, setForm]     = useState<LoginFormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()

  function handleChange(field: keyof LoginFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<LoginFormData> = {}
    if (!form.email.includes("@")) next.email = "Email invalide"
    if (!form.password)            next.password = "Mot de passe requis"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // ← ICI on appellera POST /api/v1/auth/login
      const res = await login(form)
      setAuth(res.user, res.token)
      router.push("/dashboard")
      
    } catch {
      setErrors({ password: "Email ou mot de passe incorrect" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-white mb-1.5">
          Se connecter
        </h1>
        <p className="text-sm text-white/40">
          Accédez à votre tableau de bord AviSaaS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Email"
          type="email"
          placeholder="jean@ferme.cm"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          hint="Mot de passe oublié ?"
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300
                     disabled:opacity-50 text-green-950 font-medium
                     rounded-xl text-sm transition-colors mt-1"
        >
          {loading ? "Connexion…" : "Se connecter →"}
        </button>
      </form>

      <p className="text-center text-xs text-white/30 mt-5">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-green-400 hover:text-green-300">
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </div>
  )
}