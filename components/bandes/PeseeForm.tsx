"use client"

import { useState } from "react"
import { FormField } from "@/components/ui/FormField"
import { createPesee } from "@/lib/api/pesees"

type Props = { bandeId: string; onSuccess: () => void }
const today = new Date().toISOString().split("T")[0]

export function PeseeForm({ bandeId, onSuccess }: Props) {
  const [form, setForm] = useState({
    date: today, nombreSujetsPeses: "", poidsTotalKg: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dernierEcart, setDernierEcart] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const n = Number(form.nombreSujetsPeses)
    const kg = Number(form.poidsTotalKg)
    if (!n || n <= 0)  { setError("Nombre de sujets invalide"); return }
    if (!kg || kg <= 0) { setError("Poids total invalide"); return }

    setLoading(true)
    try {
      const res = await createPesee(bandeId, {
        date: form.date, nombreSujetsPeses: n, poidsTotalKg: kg,
      })
      setForm({ date: today, nombreSujetsPeses: "", poidsTotalKg: "" })
      setSuccess(true)
      setDernierEcart(res.ecartPct)
      setTimeout(() => setSuccess(false), 3000)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur serveur.")
    } finally {
      setLoading(false)
    }
  }

  const poidsMoyenPreview =
    Number(form.poidsTotalKg) && Number(form.nombreSujetsPeses)
      ? Math.round((Number(form.poidsTotalKg) * 1000) / Number(form.nombreSujetsPeses))
      : null

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Nouvelle pesée</h2>
      <p className="text-xs text-white/40 mb-4">
        Pesez un échantillon ensemble, indiquez le poids total et le nombre de sujets.
      </p>

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg
                        px-3 py-2 text-xs text-green-300 mb-3">
          ✓ Pesée enregistrée
          {dernierEcart !== null && (
            <span className={dernierEcart < -5 ? " text-amber-300" : ""}>
              {" "}— écart {dernierEcart > 0 ? "+" : ""}{dernierEcart.toFixed(1)}% vs cible
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField label="Date" type="date" value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Sujets pesés" type="number" placeholder="Ex : 20"
            value={form.nombreSujetsPeses}
            onChange={(e) => setForm((p) => ({ ...p, nombreSujetsPeses: e.target.value }))} />
          <FormField label="Poids total (kg)" type="number" placeholder="Ex : 38.4"
            value={form.poidsTotalKg}
            onChange={(e) => setForm((p) => ({ ...p, poidsTotalKg: e.target.value }))} />
        </div>

        {poidsMoyenPreview && (
          <p className="text-[11px] text-white/30">
            Poids moyen calculé : <span className="text-white/60">{poidsMoyenPreview} g</span> / sujet
          </p>
        )}

        {error && <p className="text-xs text-red-400">⚠ {error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-green-400 hover:bg-green-300 disabled:opacity-40
                     text-green-950 font-medium rounded-xl text-sm transition-colors mt-1">
          {loading ? "Enregistrement…" : "Enregistrer la pesée"}
        </button>
      </form>
    </div>
  )
}