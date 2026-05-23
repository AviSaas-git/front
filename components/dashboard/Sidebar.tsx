"use client"

import Link        from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/constants/dashboard"

export function Sidebar() {
    
  const pathname = usePathname()

  return (
    <aside className="w-52 border-r border-white/[0.07] flex
                      flex-col bg-[#09090b] shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4
                      border-b border-white/[0.07]">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-white font-medium">AviSaaS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href

          return (
            <div key={item.href}>
              {/* Séparateur de section */}
              {item.section && (
                <p className="text-[10px] font-medium text-white/20
                               px-2 pt-4 pb-1 tracking-widest">
                  {item.section}
                </p>
              )}

              <Link
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2
                            rounded-lg text-xs transition-colors mb-0.5
                            ${isActive
                              ? "text-green-400 bg-green-400/8"
                              : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                            }`}
              >
                <i className={`ti ti-${item.icon} text-sm`}
                   aria-hidden="true" />
                {item.label}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Utilisateur */}
      <div className="p-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-2 py-1.5
                        rounded-lg hover:bg-white/[0.04]
                        cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-green-400/20
                          text-green-400 flex items-center
                          justify-center text-xs font-medium
                          flex-shrink-0">
            JM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 truncate">Jean Mbarga</p>
            <p className="text-[10px] text-white/30">Plan Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}