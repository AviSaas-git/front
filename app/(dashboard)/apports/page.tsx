"use client"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar }  from "@/components/dashboard/Topbar"

export default function RapportsPage() {
  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title="Rapports" subtitle="Analyses et exports" />
        <main className="flex-1 overflow-y-auto px-5 py-8 flex flex-col items-center justify-center gap-4">
          <p className="text-4xl">📊</p>
          <p className="text-white/60 text-sm">Module rapports — disponible prochainement.</p>
        </main>
      </div>
    </div>
  )
}