import { ALERTS } from "@/lib/constants/dashboard"
import Link from "next/link"
type Props = {
  title:    string
  subtitle?: string
  onMenuClick?: () => void
}

export function Topbar({ title, subtitle, onMenuClick }: Props) {
  return (
    <header className="flex items-center justify-between
                       px-5 py-3 border-b border-white/[0.07]
                       shrink-0">
       <button 
          onClick={onMenuClick}
          className="p-1 -ml-1 text-white/40 hover:text-white md:hidden transition-colors"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      <div>
        <h1 className="text-[15px] font-medium text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] text-white/30 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Cloche avec badge */}
        <button className="flex items-center gap-1.5 px-3 py-1.5
                           rounded-lg border border-white/10
                           text-white/50 hover:text-white/70
                           text-xs transition-colors">
          <i className="ti ti-bell text-sm" aria-hidden="true" />
          Alertes
          {ALERTS.length > 0 && (
            <span className="bg-rose-400 text-white text-[9px]
                             px-1.5 py-px rounded-full font-medium">
              {ALERTS.length}
            </span>
          )}
        </button>

     

        <Link
          href="/elevages/nouveau"
          className="px-3 py-1.5 bg-green-400 hover:bg-green-300
                    text-green-950 font-medium rounded-lg
                    text-xs transition-colors"
        >
          + Nouvel élevage
        </Link>
      </div>
    </header>
  )
}