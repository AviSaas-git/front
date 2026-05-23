import { HERO_STATS } from "@/lib/constants/landing"

export function HeroStats() {
  return (
    <div className="flex flex-wrap gap-8 sm:gap-12 justify-center mt-12">
      {HERO_STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-medium text-white">{stat.value}</div>
          <div className="text-xs text-white/40 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}