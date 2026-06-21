"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { createMortalite } from "@/lib/api/bandes"

type Props = { bandeId: string; effectifActuel: number; onSuccess: () => void }
const today = new Date().toISOString().split("T")[0]

export function MortaliteForm({ bandeId, effectifActuel, onSuccess }: Props) {
  const [form, setForm] = useState({ date: today, nombreMorts: "", cause: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const n = Number(form.nombreMorts)
    if (!n || n <= 0) { setError("Nombre de morts invalide"); return }
    if (n > effectifActuel) { setError(`Dépasse l'effectif actuel (${effectifActuel})`); return }

    setLoading(true)
    try {
      await createMortalite(bandeId, {
        date: form.date, nombreMorts: n, cause: form.cause || undefined,
      })
      setForm({ date: today, nombreMorts: "", cause: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Saisir une mortalité</h2>
      <p className="text-xs text-white/40 mb-4">
        L'effectif sera mis à jour automatiquement.
      </p>
      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">
          ✓ Mortalité enregistrée
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date" type="date" value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          <FormField label="Nombre de morts" type="number" placeholder="Ex : 5"
            value={form.nombreMorts}
            onChange={(e) => setForm((p) => ({ ...p, nombreMorts: e.target.value }))} />
        </div>
        <FormField label="Cause" placeholder="Ex : Chaleur, maladie…" hint="optionnel"
          value={form.cause}
          onChange={(e) => setForm((p) => ({ ...p, cause: e.target.value }))} />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-rose-400/90 hover:bg-rose-400 disabled:opacity-40
                     text-rose-950 font-medium rounded-xl text-sm transition-colors mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la mortalité"}
        </button>
      </form>
    </div>
  )
}