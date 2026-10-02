"use client"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"
import { useAuthStore } from "@/lib/store/auth"
import { useEffect } from "react"

export default function ParametresPage() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const user    = useAuthStore((s) => s.user)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Paramètres" subtitle="Votre compte" />
        <main className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4 max-w-lg">

          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-medium text-white mb-4">Informations du compte</h2>
            <div className="grid grid-cols-2 gap-y-3">
              {[
                ["Nom", user?.nom ?? "—"],
                ["Email", user?.email ?? "—"],
                ["Plan", user?.plan ?? "FREE"],
                ["Rôle", user?.role ?? "—"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-white/30 mb-0.5">{l}</p>
                  <p className="text-xs text-white/80">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <h2 className="text-sm font-medium text-white mb-2">Configuration ferme</h2>
            <div className="flex gap-3">
              <a href="/fermes/nouveau"
                className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10
                           text-white/60 rounded-lg transition-colors">
                + Ajouter une ferme
              </a>
              <a href="/batiments/nouveau"
                className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10
                           text-white/60 rounded-lg transition-colors">
                + Ajouter un bâtiment
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}