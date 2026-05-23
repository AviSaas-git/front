import { Sidebar }      from "./Sidebar"
import { Topbar }       from "./Topbar"
import { AlertBanner }  from "./AlertBanner"
import { KpiGrid }      from "./KpiGrid"
import { ElevageTable } from "./ElevageTable"

export function DashboardShell() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  })

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <Topbar
          title="Tableau de bord"
          subtitle={`ets ferme tewe · ${today}`}
        />

        <main className="flex-1 overflow-y-auto px-5 py-4
                         flex flex-col gap-4">
          <AlertBanner />
          <KpiGrid />
          <ElevageTable />
        </main>

      </div>
    </div>
  )
}