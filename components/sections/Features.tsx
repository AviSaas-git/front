import { FEATURES } from "@/lib/constants/landing"

export function Features() {
  return (
    <section
      id="features"
      className="px-4 pb-28"
    >
      <div className="max-w-7xl mx-auto border border-white/[0.06] rounded-[32px] bg-[#0b0b0d] p-6 sm:p-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-green-400 text-xs tracking-[0.25em] uppercase font-medium mb-4">
            Fonctionnalités
          </p>

          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-5">
            Tout ce dont vous avez besoin
          </h2>

          <p className="text-white/45 text-lg leading-relaxed">
            Une plateforme complète, du suivi quotidien des bandes
            à l&apos;analyse de performance avancée.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((feature) => {
        const Icon = feature.icon

  return (
    <div
      key={feature.title}
      className={`
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        p-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-green-400/20
        hover:bg-white/[0.04]
        ${
          "badge" in feature
            ? "border-green-400/20 bg-green-400/[0.03]"
            : "border-white/[0.07] bg-white/[0.025]"
        }
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-green-400/[0.03] to-transparent pointer-events-none" />

      {/* Icon */}
      <div
        className={`
          relative
          w-14 h-14
          rounded-2xl
          flex items-center justify-center
          mb-7
          border border-white/5
          ${feature.bg}
        `}
      >
        <Icon className={`w-6 h-6 ${feature.color}`} />
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[22px] font-medium tracking-tight text-white">
          {feature.title}
        </h3>

        {"badge" in feature && (
          <span className="bg-green-400/15 text-green-400 text-[10px] px-2 py-1 rounded-full font-medium">
            {feature.badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[15px] leading-8 text-white/45">
        {feature.desc}
      </p>
    </div>
  )
})}
        </div>
      </div>
    </section>
  )
}