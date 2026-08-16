"use client"

import { AlertBanner } from "@/components/dashboard/AlertBanner"
import  {ElevageTable}  from "@/components/dashboard/ElevageTable"
import { KpiGrid } from "@/components/dashboard/KpiGrid"
import { useQuery }      from "@tanstack/react-query"
import { fetchDashboard } from "@/lib/api/dashboard"
import { useAuthStore } from "@/lib/store/auth"
import { Sidebar }       from "@/components/dashboard/Sidebar"
import { Topbar }        from "@/components/dashboard//Topbar"
import { useEffect, useState } from "react"


export default function BandesPage() {

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
             <></>
              )}
    
              <ElevageTable ready />
            </main>
          </div>
        </div>
  )
}