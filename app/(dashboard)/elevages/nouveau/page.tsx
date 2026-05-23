"use client"

import { useRouter }          from "next/navigation"
import { NouvelElevageShell } from "@/components/elevages/NouvelElevageShell"

export default function NouvelElevagePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center
                     justify-center px-4 py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2
                      w-96 h-96 bg-green-400/4 rounded-full
                      blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md">
        <NouvelElevageShell
          onCancel={() => router.push("/dashboard")}
        />
      </div>
    </main>
  )
}