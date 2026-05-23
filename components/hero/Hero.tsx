import { HeroBadge }      from "./HeroBadge"
import { HeroButtons }    from "./HeroButtons"
import { HeroStats }      from "./HeroStats"
import { DashboardPreview } from "./DashboardPreview"

export function Hero() {
  return (
    <section>
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
        <HeroBadge />
        <h1 className="text-5xl sm:text-6xl font-medium text-white leading-[1.1] tracking-tight mb-5">
          Gérez votre élevage
          <br />
          avec{" "}
          <span className="text-green-400">l&apos;intelligence</span>
        </h1>
        <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
          Bandes, animaux, alimentation, santé, reproduction — tout centralisé dans
          une plateforme SaaS moderne conçue pour les éleveurs professionnels.
        </p>
        <HeroButtons />
        <HeroStats />
      </div>
      <DashboardPreview />
    </section>
  )
}