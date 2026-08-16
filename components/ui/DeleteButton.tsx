"use client"

import { useState } from "react"
import { toastSuccess, toastError, traduireErreur } from "@/lib/toast"

type Props = {
  label?:       string
  confirmMsg?:  string
  onDelete:     () => Promise<void>
  onSuccess?:   () => void
  successMsg?:  string
}

export function DeleteButton({
  label       = "Supprimer",
  confirmMsg  = "Confirmer la suppression ?",
  onDelete,
  onSuccess,
  successMsg  = "Supprimé avec succès.",
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading]       = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await onDelete()
      toastSuccess(successMsg)
      onSuccess?.()
    } catch (err: any) {
      toastError(traduireErreur(err))
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-[11px] px-2.5 py-1 text-rose-400/70
                   hover:text-rose-400 hover:bg-rose-400/10
                   rounded-lg transition-colors"
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-white/50">{confirmMsg}</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-[11px] px-2.5 py-1 bg-rose-400/15
                   text-rose-300 hover:bg-rose-400/25
                   rounded-lg transition-colors disabled:opacity-40"
      >
        {loading ? "…" : "Oui"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-[11px] px-2.5 py-1 text-white/40
                   hover:text-white/60 rounded-lg transition-colors"
      >
        Non
      </button>
    </div>
  )
}