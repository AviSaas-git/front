"use client"

import { useEffect, useState }     from "react"
import { useQuery }      from "@tanstack/react-query"
import { Sidebar }       from "./Sidebar"
import { Topbar }        from "./Topbar"
import { AlertBanner }   from "./AlertBanner"
import { KpiGrid }       from "./KpiGrid"
import { ElevageTable }  from "./ElevageTable"
import { useAuthStore }  from "@/lib/store/auth"
import { fetchDashboard } from "@/lib/api/dashboard"

export function DashboardShell() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const user    = useAuthStore((s) => s.user)
  const token   = useAuthStore((s) => s.token)


    // ← indique que le client est prêt
  const [ready, setReady] = useState(false)

   useEffect(() => {
    hydrate()           // recharge user + token depuis localStorage
    setReady(true)      // débloque les requêtes
  }, [hydrate])

   const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn:  fetchDashboard,
    enabled:  ready && !!token,   // ← ne part QUE quand le token est là
    staleTime: 30_000,
  })



  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric",
    month: "long",  year: "numeric",
  })

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title="Tableau de bord"
          subtitle={`${user?.nom ?? "..."} · ${today}`}
        />
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <AlertBanner />

          {isLoading ? (
            // Skeleton pendant le chargement
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className="bg-white/[0.03] border border-white/[0.07]
                             rounded-xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : (
            <KpiGrid
              totalBandes={data?.totalBandesActives ?? 0}
              totalAnimaux={data?.totalAnimauxIndividuels ?? 0}
              totalFermes={data?.totalFermes ?? 0}
              totalBatiments={data?.totalBatiments ?? 0}
            />
          )}

          <ElevageTable ready />
        </main>
      </div>
    </div>
  )
}