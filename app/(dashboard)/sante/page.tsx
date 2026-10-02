"use client"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"

export default function SantePage() {
  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Santé" subtitle="Suivi sanitaire global" />
        <main className="flex-1 overflow-y-auto px-5 py-8 flex flex-col items-center justify-center gap-4">
          <p className="text-4xl">💉</p>
          <p className="text-white/60 text-sm">
            Consultez la prophylaxie et mortalité depuis la fiche de chaque bande.
          </p>
          <a href="/bandes"
            className="text-green-400 text-xs underline hover:text-green-300">
            Voir mes bandes →
          </a>
        </main>
      </div>
    </div>
  )
}