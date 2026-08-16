"use client"

import Link from "next/link"
import { NAV_ITEMS } from "@/lib/constants/dashboard"
import { useAuthStore } from "@/lib/store/auth"
import { IconSettings } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useRouter, usePathname } from "next/navigation"

import { toastSuccess } from "@/lib/toast"


export function Sidebar() {
  const pathname    = usePathname()
  const router      = useRouter()
  const qc          = useQueryClient()
  const menuRef     = useRef<HTMLDivElement>(null)
  const hydrate     = useAuthStore((s) => s.hydrate)
  const user        = useAuthStore((s) => s.user)
  const logout      = useAuthStore((s) => s.logout)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => { hydrate() }, [hydrate])

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    qc.clear()
    toastSuccess("Déconnexion réussie.")
    router.push("/login")
  }

  // Initiales de l'utilisateur pour l'avatar
  const initiales = user?.nom
    ? user.nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <aside className="w-64 bg-[#09090b] border-r border-white/[0.07] flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 border-b border-white/[0.07] flex items-center px-5">
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center font-bold text-black">
          A
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-white">AviSaaS</p>
          <p className="text-[10px] text-white/35">Smart Livestock ERP</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item, index) => {
          const active = pathname === item.href
          const Icon = item.icon; // 🟢 C'est directement le composant !

          return (
            <div key={`${item.label}-${index}`} className="mb-2">
              {item.section && (
                <p className="px-2 mb-2 mt-4 text-[10px] uppercase tracking-[0.18em] text-white/25">
                  {item.section}
                </p>
              )}

              <Link
                href={item.href ?? "#"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-green-500/10 text-green-400 font-medium"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {/* 🟢 Rendu direct et instantané de l'icône */}
                {Icon && <Icon size={18} className={active ? "text-green-400" : "opacity-70"} />}
                
                <span className="flex-1 truncate">{item.label}</span>

                {item.badge && (
                  <span className="min-w-[20px] h-5 rounded-full bg-green-500 text-black text-[10px] flex items-center justify-center px-1.5 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer utilisateur */}
       {/* Utilisateur + déconnexion */}
      <div className="p-3 border-t border-white/[0.07] shrink-0 relative"
           ref={menuRef}>

        {/* Menu flottant — au dessus */}
        {showMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2
                          bg-[#18181b] border border-white/10
                          rounded-xl overflow-hidden shadow-2xl z-50">

            {/* Infos utilisateur */}
            <div className="px-3 py-2.5 border-b border-white/[0.07]">
              <p className="text-xs text-white/80 font-medium truncate">
                {user?.nom ?? "Utilisateur"}
              </p>
              <p className="text-[10px] text-white/40 truncate mt-0.5">
                {user?.email ?? ""}
              </p>
              <span className="inline-block text-[10px] font-medium px-2 py-0.5
                               bg-green-400/10 text-green-300 rounded-full mt-1">
                {user?.plan ?? "FREE"}
              </span>
            </div>

            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 text-xs
                         text-rose-300 hover:bg-rose-400/10
                         transition-colors flex items-center gap-2"
            >
              <span className="text-base leading-none">⏻</span>
              Se déconnecter
            </button>
          </div>
        )}

        {/* Avatar cliquable */}
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="w-full flex items-center gap-2.5 px-2 py-1.5
                     rounded-lg hover:bg-white/[0.04] cursor-pointer
                     transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-green-400/20
                          text-green-400 flex items-center justify-center
                          text-xs font-medium flex-shrink-0">
            {initiales}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 truncate">
              {user?.nom ?? "..."}
            </p>
            <p className="text-[10px] text-white/30">
              {user?.plan ?? ""}
            </p>
          </div>
          {/* Indicateur menu ouvert/fermé */}
          <span className={`text-white/30 text-xs transition-transform duration-150
                            ${showMenu ? "rotate-180" : ""}`}>
            ⌃
          </span>
        </button>

      </div>
    </aside>
  )
}