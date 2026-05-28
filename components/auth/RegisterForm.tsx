"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormField } from "@/components/ui/FormField"
import type { RegisterFormData } from "@/lib/types/forms"
import { register } from "@/lib/api/auth"
import { useAuthStore } from "@/lib/store/auth"

// Valeurs initiales
const INITIAL: RegisterFormData = {
  nom:       "",
  email:     "",
  telephone: "",
  password:  "",
  plan:      "FREE",
}

const PLAN_OPTIONS = [
  { value: "FREE",       label: "Free — 0 FCFA/mois" },
  { value: "PRO",        label: "Pro — 15 000 FCFA/mois" },
  { value: "ENTERPRISE", label: "Enterprise — Sur devis" },
]

export function RegisterForm() {
  const router   = useRouter()
  const [form, setForm]     = useState<RegisterFormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [loading, setLoading] = useState(false)
 const { setAuth } = useAuthStore()


  // Mise à jour d'un champ
  function handleChange(field: keyof RegisterFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Efface l'erreur dès que l'utilisateur corrige
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Validation locale avant envoi
  function validate(): boolean {
    const next: Partial<RegisterFormData> = {}

    if (!form.nom.trim())
      next.nom = "Le nom est obligatoire"

    if (!form.email.includes("@"))
      next.email = "Email invalide"

    if (form.password.length < 8)
      next.password = "Minimum 8 caractères"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
   try {
     const response = await register(form)


  useAuthStore.getState().setAuth(
  {
    id: response.userId,
    nom: response.nom,
    email: response.email,
    role: response.role,
    tenantId: response.tenantId,
    plan: response.plan,
  },
  response.token
)
     router.push("/setup")
    }catch {
      setErrors({ email: "Une erreur est survenue. Réessayez." })
    } finally {
    }
      setLoading(false)
    }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7">

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 bg-green-400/10
                        border border-green-400/20 text-green-300 px-3 py-1
                        rounded-full text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Étape 1 sur 4
        </div>
        <h1 className="text-xl font-medium text-white mb-1.5">
          Créer votre compte
        </h1>
        <p className="text-sm text-white/40 leading-relaxed">
          Gratuit, sans carte bancaire. Votre espace isolé sur AviSaaS.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <FormField
          label="Nom complet"
          placeholder="Jean Mbarga"
          value={form.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          error={errors.nom}
          autoComplete="name"
        />

        <div className="grid grid-cols-2 gap-3">
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
            label="Téléphone"
            type="tel"
            placeholder="+237 6XX XXX"
            value={form.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            hint="optionnel"
          />
        </div>

        <FormField
          label="Mot de passe"
          type="password"
          placeholder="Minimum 8 caractères"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          hint="min. 8 caractères"
          autoComplete="new-password"
        />

        <FormField
          as="select"
          label="Plan"
          options={PLAN_OPTIONS}
          value={form.plan}
          onChange={(e) => handleChange("plan", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-green-950 font-medium rounded-xl text-sm
                     transition-colors mt-1"
        >
          {loading ? "Création en cours…" : "Créer mon compte →"}
        </button>
      </form>

      {/* Lien vers connexion */}
      <p className="text-center text-xs text-white/30 mt-5">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-green-400 hover:text-green-300">
          Se connecter
        </Link>
      </p>
    </div>
  )
}